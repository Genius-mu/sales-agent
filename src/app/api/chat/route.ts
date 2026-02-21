import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "@/lib/supabase";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { message, sessionId, businessId } = await req.json();

  if (!message || !sessionId || !businessId) {
    return NextResponse.json(
      { error: "message, sessionId, and businessId are required" },
      { status: 400 },
    );
  }

  // Fetch business context
  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("scraped_content, agent_persona, name")
    .eq("id", businessId)
    .single();

  if (businessError || !business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  // Fetch existing conversation history
  const { data: convo } = await supabase
    .from("conversations")
    .select("messages")
    .eq("session_id", sessionId)
    .single();

  const history: { role: "user" | "assistant"; content: string }[] =
    convo?.messages || [];

  const systemPrompt = `You are a helpful AI sales assistant for ${business.name || "this company"}.
Your persona: ${business.agent_persona || "friendly and professional"}.

Here is everything you know about the business:
---
${business.scraped_content || "No information available yet."}
---

Your goals:
1. Answer questions about the business warmly and accurately based only on the info above
2. Qualify the visitor — understand their needs, budget, and timeline naturally in conversation
3. If they seem like a good fit, ask for their email and offer to book a call
4. Never make up information not found in the business info above
5. Keep responses concise — 2-3 sentences max unless they ask for more detail
6. Be conversational, not robotic

Important: If the visitor provides their email address, output it on its own line at the very end of your message in exactly this format:
LEAD_EMAIL: their@email.com`;

  const updatedHistory = [
    ...history,
    { role: "user" as const, content: message },
  ];

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system: systemPrompt,
      messages: updatedHistory,
    });

    const rawReply =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Extract lead email if captured
    const emailMatch = rawReply.match(/LEAD_EMAIL:\s*(\S+@\S+\.\S+)/);
    const leadEmail = emailMatch ? emailMatch[1] : null;
    const cleanReply = rawReply.replace(/LEAD_EMAIL:.*$/m, "").trim();

    const finalHistory = [
      ...updatedHistory,
      { role: "assistant" as const, content: cleanReply },
    ];

    // Upsert conversation (insert or update by session_id)
    await supabase.from("conversations").upsert(
      {
        session_id: sessionId,
        business_id: businessId,
        messages: finalHistory,
        ...(leadEmail && { lead_email: leadEmail }),
      },
      { onConflict: "session_id" },
    );

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    return NextResponse.json(
      {
        reply: cleanReply,
        leadCaptured: !!leadEmail,
        ...(leadEmail && { leadEmail }),
      },
      { headers: corsHeaders },
    );
  } catch (err) {
    console.error("Claude API error:", err);
    return NextResponse.json(
      { error: "Failed to get response from AI" },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
