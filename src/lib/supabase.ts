import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// Helper: get the business ID for the currently logged-in user
export async function getBusinessId(): Promise<string | null> {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;
  if (!userId) return null;

  const { data } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", userId)
    .single();

  return data?.id || null;
}
