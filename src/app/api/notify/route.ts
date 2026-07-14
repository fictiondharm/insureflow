import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, product, amount, policyId } = await req.json();

    if (!email || !product || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.log("[notify] No RESEND_API_KEY set — skipping email");
      return NextResponse.json({ ok: true, note: "simulated" });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const fromName = process.env.RESEND_FROM_NAME || "InsureFlow";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: email,
        subject: `Your ${product} policy paid out $${amount}!`,
        text: [
          `Hi there,`,
          ``,
          `Your policy #${policyId} (${product}) has triggered a payout of $${amount} USDC.`,
          ``,
          `It's been sent directly to your wallet on Base Sepolia.`,
          ``,
          `— InsureFlow`,
        ].join("\n"),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[notify] Resend error:", err);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    console.log("[notify] Email sent to", email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[notify] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
