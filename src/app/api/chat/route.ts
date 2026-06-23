import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
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

const PLAN_LIMITS: Record<string, number> = {
  free: 50,
  starter: 500,
  pro: Infinity,
  scale: Infinity,
};

async function sendLimitEmail(
  businessEmail: string,
  businessName: string,
  appUrl: string,
) {
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Saim <noreply@adegbitemustapha73@gmail.com>",
        to: businessEmail,
        subject:
          "You've reached your conversation limit — upgrade to keep going",
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;background:#fff;">
            <div style="margin-bottom:32px;">
              <div style="width:36px;height:36px;background:#2563eb;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
                <span style="color:#fff;font-size:16px;font-weight:800;">S</span>
              </div>
              <h1 style="font-size:22px;font-weight:700;color:#18181b;margin:0 0 8px;">You've hit your monthly limit</h1>
              <p style="color:#71717a;font-size:14px;line-height:1.6;margin:0;">
                Hi there — your Saim agent for <strong style="color:#18181b;">${businessName}</strong> has reached its 50 free conversations this month. Your widget is now paused until you upgrade.
              </p>
            </div>
            <div style="background:#f4f4f5;border-radius:12px;padding:20px;margin-bottom:24px;">
              <p style="color:#18181b;font-size:13px;font-weight:600;margin:0 0 12px;">What you get on Starter ($49/mo):</p>
              <ul style="color:#52525b;font-size:13px;line-height:2;margin:0;padding-left:16px;">
                <li>500 conversations/month</li>
                <li>Lead capture & dashboard</li>
                <li>Priority email support</li>
              </ul>
            </div>
            <a href="${appUrl}/dashboard/billing" style="display:inline-block;background:#2563eb;color:#fff;font-size:14px;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none;">
              Upgrade now →
            </a>
            <p style="color:#a1a1aa;font-size:12px;margin-top:24px;">
              You're receiving this because you have a Saim account. <a href="${appUrl}/dashboard" style="color:#a1a1aa;">Manage your account</a>
            </p>
          </div>
        `,
      }),
    });
  } catch (e) {
    console.error("Failed to send limit email:", e);
  }
}

async function sendLeadEmail(
  ownerEmail: string,
  businessName: string,
  leadEmail: string,
  conversation: { role: string; content: string }[],
  appUrl: string,
) {
  console.log(
    "[Resend] sendLeadEmail called. Key present:",
    !!process.env.RESEND_API_KEY,
    "to:",
    ownerEmail,
  );
  try {
    // Build a short transcript of the last few messages
    const transcript = conversation
      .slice(-6)
      .map(
        (m) =>
          `<p style="margin:0 0 8px;"><strong style="color:${m.role === "user" ? "#2563eb" : "#18181b"};">${m.role === "user" ? "Visitor" : "Agent"}:</strong> <span style="color:#52525b;">${m.content.replace(/</g, "&lt;")}</span></p>`,
      )
      .join("");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Saim <onboarding@resend.dev>",
        to: ownerEmail,
        subject: `🎯 New lead captured on ${businessName}`,
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;background:#fff;">
            <div style="margin-bottom:24px;">
              <div style="width:36px;height:36px;background:#2563eb;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
                <span style="color:#fff;font-size:16px;font-weight:800;">S</span>
              </div>
              <h1 style="font-size:22px;font-weight:800;color:#18181b;margin:0 0 8px;">You captured a new lead! 🎯</h1>
              <p style="color:#71717a;font-size:14px;line-height:1.6;margin:0;">
                Your Saim agent on <strong style="color:#18181b;">${businessName}</strong> just captured a lead. Here are the details:
              </p>
            </div>

            <div style="background:#eff6ff;border:1px solid #dbeafe;border-radius:12px;padding:18px;margin-bottom:20px;">
              <p style="color:#71717a;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;font-weight:700;margin:0 0 6px;">Lead email</p>
              <a href="mailto:${leadEmail}" style="color:#2563eb;font-size:18px;font-weight:700;text-decoration:none;">${leadEmail}</a>
            </div>

            <div style="background:#f9fafb;border:1px solid #f0f0f0;border-radius:12px;padding:18px;margin-bottom:24px;">
              <p style="color:#71717a;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;font-weight:700;margin:0 0 12px;">Conversation</p>
              ${transcript}
            </div>

            <a href="${appUrl}/dashboard/conversations" style="display:inline-block;background:#2563eb;color:#fff;font-size:14px;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none;">
              View in dashboard →
            </a>

            <p style="color:#a1a1aa;font-size:12px;margin-top:24px;">
              Follow up quickly — leads are most likely to convert within the first hour. 🚀
            </p>
          </div>
        `,
      }),
    });

    const result = await res.json();
    if (!res.ok) {
      console.error(
        "[Resend] Lead email failed:",
        res.status,
        JSON.stringify(result),
      );
    } else {
      console.log("[Resend] Lead email sent:", result.id, "to", ownerEmail);
    }
  } catch (e) {
    console.error("Failed to send lead email:", e);
  }
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

  // Fetch business including plan and owner email
  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("name, agent_persona, description, scraped_content, plan, user_id")
    .eq("id", businessId)
    .single();

  if (businessError || !business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const plan = (business.plan as string) || "free";
  const limit = PLAN_LIMITS[plan] ?? 50;

  // Count conversations this month
  if (limit !== Infinity) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("conversations")
      .select("id", { count: "exact", head: true })
      .eq("business_id", businessId)
      .gte("created_at", startOfMonth.toISOString());

    const used = count ?? 0;

    if (used >= limit) {
      // Send email on first hit (when used === limit exactly)
      if (used === limit && business.user_id) {
        const { data: userData } = await supabase.auth.admin.getUserById(
          business.user_id,
        );
        const email = userData?.user?.email;
        if (email) {
          const appUrl =
            process.env.NEXT_PUBLIC_APP_URL ||
            "https://sales-agent-jet.vercel.app";
          await sendLimitEmail(email, business.name || "your business", appUrl);
        }
      }

      return NextResponse.json(
        {
          reply: null,
          limitReached: true,
          plan,
          upgradeUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://sales-agent-jet.vercel.app"}/dashboard/billing`,
        },
        { headers: corsHeaders },
      );
    }
  }

  const { data: convo } = await supabase
    .from("conversations")
    .select("messages")
    .eq("session_id", sessionId)
    .single();

  const history: { role: "user" | "assistant"; content: string }[] =
    convo?.messages || [];

  const knowledgeParts: string[] = [];
  if (business.description)
    knowledgeParts.push(`BUSINESS OVERVIEW:\n${business.description}`);
  if (business.scraped_content)
    knowledgeParts.push(`WEBSITE CONTENT:\n${business.scraped_content}`);
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

    const { data: existing } = await supabase
      .from("conversations")
      .select("id, lead_email")
      .eq("session_id", sessionId)
      .maybeSingle();

    // Track whether this lead was already captured before this message
    const leadAlreadyExisted = !!existing?.lead_email;

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

    // Send lead notification email — only when a NEW lead is captured
    console.log(
      "[Lead] check — leadEmail:",
      leadEmail,
      "alreadyExisted:",
      leadAlreadyExisted,
      "user_id:",
      business.user_id,
    );
    if (leadEmail && !leadAlreadyExisted && business.user_id) {
      const { data: userData } = await supabase.auth.admin.getUserById(
        business.user_id,
      );
      const ownerEmail = userData?.user?.email;
      console.log("[Lead] ownerEmail resolved to:", ownerEmail);
      if (ownerEmail) {
        const appUrl = (
          process.env.NEXT_PUBLIC_APP_URL ||
          "https://sales-agent-jet.vercel.app"
        ).replace(/\/+$/, "");
        await sendLeadEmail(
          ownerEmail,
          business.name || "your site",
          leadEmail,
          finalHistory,
          appUrl,
        );
      }
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
