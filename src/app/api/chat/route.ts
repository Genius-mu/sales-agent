import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(req: NextRequest) {
  const { message, sessionId, businessId } = await req.json();

  // Fetch business context
  const { data: business } = await supabase
    .from("businesses")
    .select("scraped_content, agent_persona, name")
    .eq("id", businessId)
    .single();

  // Fetch conversation history
  const { data: convo } = await supabase
    .from("conversations")
    .select("messages")
    .eq("session_id", sessionId)
    .single();

  const history = convo?.messages || [];

  const systemPrompt = `You are a helpful AI sales assistant for ${business?.name || "this company"}.
Your persona: ${business?.agent_persona}.

Here is everything you know about the business:
---
${business?.scraped_content || "No information available yet."}
---

Your goals:
1. Answer questions about the business warmly and accurately
2. Qualify the visitor (understand their needs, budget, timeline)
3. If they seem like a good fit, capture their email and offer to book a call
4. Never make up information not found above
5. Keep responses concise — 2-3 sentences max unless they ask for detail

If you capture an email, output it on its own line exactly like: LEAD_EMAIL: example@email.com`;

  const newHistory = [...history, { role: "user", content: message }];

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 500,
    system: systemPrompt,
    messages: newHistory,
  });

  const reply =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Check if agent captured a lead email
  const emailMatch = reply.match(/LEAD_EMAIL:\s*(\S+@\S+)/);
  const leadEmail = emailMatch ? emailMatch[1] : null;
  const cleanReply = reply.replace(/LEAD_EMAIL:.*/, "").trim();

  const updatedHistory = [
    ...newHistory,
    { role: "assistant", content: cleanReply },
  ];

  // Upsert conversation
  await supabase.from("conversations").upsert(
    {
      session_id: sessionId,
      business_id: businessId,
      messages: updatedHistory,
      ...(leadEmail && { lead_email: leadEmail }),
    },
    { onConflict: "session_id" },
  );

  return NextResponse.json({ reply: cleanReply, leadCaptured: !!leadEmail });
}
