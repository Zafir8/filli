const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const { email } = (await request.json().catch(() => ({}))) as { email?: unknown };
  if (typeof email !== "string" || !EMAIL.test(email)) {
    return Response.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }
  // TODO: connect to your mailing list / CRM (Mailchimp, Resend, Google Sheets…).
  console.log("[notify] new Sri Lanka launch sign-up:", email);
  return Response.json({ ok: true });
}
