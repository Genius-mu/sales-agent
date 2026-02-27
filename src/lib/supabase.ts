import { createBrowserClient } from "@supabase/ssr";

let _client: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabase() {
  if (!_client) {
    _client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return _client;
}

export async function getBusinessId(): Promise<string | null> {
  const sb = getSupabase();
  const {
    data: { session },
  } = await sb.auth.getSession();
  const userId = session?.user?.id;
  if (!userId) return null;

  const { data } = await sb
    .from("businesses")
    .select("id")
    .eq("user_id", userId)
    .single();

  return data?.id || null;
}
