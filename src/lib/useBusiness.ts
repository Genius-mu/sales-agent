import { useEffect, useState } from "react";
import { getSupabase } from "./supabase";

export function useBusiness() {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { session },
      } = await getSupabase().auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      const { data } = await getSupabase()
        .from("businesses")
        .select("id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      setBusinessId(data?.id ?? null);
      setLoading(false);
    }
    load();
  }, []);

  return { businessId, loading };
}
