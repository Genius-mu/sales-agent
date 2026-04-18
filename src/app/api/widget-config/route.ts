import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get("businessId");

  if (!businessId) {
    return NextResponse.json(
      { error: "businessId required" },
      { status: 400, headers: corsHeaders },
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data, error } = await supabase
    .from("businesses")
    .select("agent_name, widget_color")
    .eq("id", businessId)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { agent_name: "Sales Assistant", widget_color: "#2563eb" },
      { headers: corsHeaders },
    );
  }

  return NextResponse.json(
    {
      agent_name: data.agent_name || "Sales Assistant",
      widget_color: data.widget_color || "#2563eb",
    },
    { headers: corsHeaders },
  );
}
