import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { randomBytes } from "crypto";
import {
  findSubscriberByEmail,
  createPendingSubscriber,
  updateSubscriberToken,
} from "@/lib/firebase/newsletter";
import {
  getSiteName,
  normalizeDomain,
  buildConfirmationEmail,
} from "@/lib/email/templates";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOKEN_EXPIRY_HOURS = 48;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, profileData } = body;

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const domain = normalizeDomain(request.headers.get("host"));
    const siteName = getSiteName(domain);

    const existing = await findSubscriberByEmail(normalizedEmail);

    if (existing && existing.data.status === "active") {
      return NextResponse.json({ alreadySubscribed: true });
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    if (existing && existing.data.status === "pending") {
      await updateSubscriberToken(existing.id, token, expiresAt);
    } else {
      await createPendingSubscriber({
        email: normalizedEmail,
        token,
        expiresAt,
        domain,
        profileData,
      });
    }

    if (process.env.RESEND_API_KEY) {
      const confirmUrl = `https://www.${domain}/confirm?token=${token}`;
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: `${siteName} <noreply@${domain}>`,
          to: normalizedEmail,
          subject: `Action required: Confirm your subscription to ${siteName}`,
          html: buildConfirmationEmail({ siteName, confirmUrl }),
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        return NextResponse.json(
          { error: "Failed to send confirmation email. Please try again." },
          { status: 500 }
        );
      }
    } else {
      console.warn("RESEND_API_KEY not set — skipping confirmation email");
    }

    return NextResponse.json({ success: true, pending: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
