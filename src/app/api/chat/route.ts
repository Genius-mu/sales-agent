import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const { message, sessionId, businessId } = await req.json();

  if (!message || !sessionId || !businessId) {
    return NextResponse.json(
      { error: "message, sessionId, and businessId are required" },
      { status: 400 },
    );
  }

  // Now also fetches description
  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("name, agent_persona, description, scraped_content")
    .eq("id", businessId)
    .single();

  if (businessError || !business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const { data: convo } = await supabase
    .from("conversations")
    .select("messages")
    .eq("session_id", sessionId)
    .single();

  const history: { role: "user" | "assistant"; content: string }[] =
    convo?.messages || [];

  // Build knowledge base from both description and scraped content
  const knowledgeParts: string[] = [];

  if (business.description) {
    knowledgeParts.push(`BUSINESS OVERVIEW:\n${business.description}`);
  }

  if (business.scraped_content) {
    knowledgeParts.push(`WEBSITE CONTENT:\n${business.scraped_content}`);
  }

  const knowledge =
    knowledgeParts.length > 0
      ? knowledgeParts.join("\n\n")
      : "No business information available yet.";

  const systemPrompt = `You are a helpful AI sales assistant for ${business.name || "this company"}.
Your persona: ${business.agent_persona || "friendly and professional"}.

Here is everything you know about the business:
---
${knowledge}
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

    const emailMatch = rawReply.match(/LEAD_EMAIL:\s*(\S+@\S+\.\S+)/);
    const leadEmail = emailMatch ? emailMatch[1] : null;
    const cleanReply = rawReply.replace(/LEAD_EMAIL:.*$/m, "").trim();

    const finalHistory = [
      ...updatedHistory,
      { role: "assistant" as const, content: cleanReply },
    ];

    // Check if conversation already exists for this session
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("session_id", sessionId)
      .maybeSingle();

    if (existing?.id) {
      const { error: updateError } = await supabase
        .from("conversations")
        .update({
          messages: finalHistory,
          ...(leadEmail && { lead_email: leadEmail }),
        })
        .eq("id", existing.id);
      if (updateError) console.error("Conversation update error:", updateError);
    } else {
      const { error: insertError } = await supabase
        .from("conversations")
        .insert({
          session_id: sessionId,
          business_id: businessId,
          messages: finalHistory,
          created_at: new Date().toISOString(),
          ...(leadEmail && { lead_email: leadEmail }),
        });
      if (insertError) console.error("Conversation insert error:", insertError);
    }

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
