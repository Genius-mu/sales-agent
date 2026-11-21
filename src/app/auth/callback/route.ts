import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  // Only allow same-site paths ("/dashboard"), never "//evil.com" or "@evil.com"
  const rawNext = searchParams.get("next") ?? "/dashboard";
  const next = /^\/(?![\/\\])/.test(rawNext) ? rawNext : "/dashboard";
  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");

  if (error || error_description) {
    const errorMsg = error_description || error || "Authentication error";
    if (next.startsWith("/auth/reset-password")) {
      return NextResponse.redirect(
        `${origin}/auth/reset-password?error=${encodeURIComponent(errorMsg)}`
      );
    }
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorMsg)}`
    );
  }

  if (code) {
    const cookieStore = await cookies();

    // Auth client (anon key) — just for session exchange
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

      // Admin client (service role) — bypasses RLS for business creation
      const adminSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
      );

      // Check if this user already has a business
      const { data: existing } = await adminSupabase
        .from("businesses")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (!existing) {
        // Always give a new user their own fresh business. (Never hand out an
        // ownerless row: it could contain someone else's conversations.)
        await adminSupabase.from("businesses").insert({
          user_id: userId,
          name: email.split("@")[0],
          plan: "free",
          subscription_status: "inactive",
        });
      }

    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
