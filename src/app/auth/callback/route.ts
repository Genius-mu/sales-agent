import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      },
    );

    await supabase.auth.exchangeCodeForSession(code);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      const userId = session.user.id;
      const email = session.user.email ?? "";

      // Check if this user already has a business
      const { data: existing } = await supabase
        .from("businesses")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (!existing) {
        // Check if there's an unclaimed business (user_id is null)
        // This handles the case where a business was created manually in Supabase
        const { data: unclaimed } = await supabase
          .from("businesses")
          .select("id")
          .is("user_id", null)
          .limit(1)
          .single();

        if (unclaimed) {
          // Claim the existing unclaimed business
          await supabase
            .from("businesses")
            .update({ user_id: userId })
            .eq("id", unclaimed.id);
        } else {
          // Create a brand new business for this user
          await supabase.from("businesses").insert({
            user_id: userId,
            name: email.split("@")[0],
            plan: "free",
            subscription_status: "inactive",
          });
        }
      }
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
