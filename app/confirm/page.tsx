import Link from "next/link";
import { Resend } from "resend";
import { CheckCircle2, XCircle, Clock, AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  findSubscriberByToken,
  activateSubscriber,
} from "@/lib/firebase/newsletter";
import { getSiteName, buildWelcomeEmail } from "@/lib/email/templates";

type Status = "success" | "expired" | "invalid" | "already-confirmed" | "error";

async function verifyToken(token: string | undefined): Promise<Status> {
  if (!token) return "invalid";

  try {
    const subscriber = await findSubscriberByToken(token);
    if (!subscriber) return "invalid";

    if (subscriber.data.status === "active") {
      return "already-confirmed";
    }

    const expiresAt = subscriber.data.tokenExpiresAt?.toDate();
    if (!expiresAt || expiresAt < new Date()) {
      return "expired";
    }

    await activateSubscriber(subscriber.id);

    const domain = subscriber.data.domain || "getbonuscasinos.com";
    const siteName = getSiteName(domain);

    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: `${siteName} <noreply@${domain}>`,
          to: subscriber.data.email,
          subject: `Welcome to ${siteName} — Your bonuses are ready 🎰`,
          html: buildWelcomeEmail({ siteName, domain }),
        });
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }
    }

    return "success";
  } catch (error) {
    console.error("Token verification error:", error);
    return "error";
  }
}

const STATUS_CONFIG: Record<
  Status,
  {
    iconBg: string;
    iconColor: string;
    title: string;
    message: string;
    cta: string;
  }
> = {
  success: {
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    title: "Subscription Confirmed!",
    message:
      "Welcome to the community. Check your inbox for your welcome email and exclusive casino bonuses.",
    cta: "Explore Bonuses",
  },
  "already-confirmed": {
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    title: "You're Already Subscribed",
    message: "Your subscription is already confirmed. You're all set to receive our exclusive offers.",
    cta: "Return to Home",
  },
  expired: {
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
    title: "Link Expired",
    message:
      "This confirmation link is no longer valid. Please subscribe again to receive a fresh link.",
    cta: "Subscribe Again",
  },
  invalid: {
    iconBg: "bg-red-500/10",
    iconColor: "text-red-600 dark:text-red-400",
    title: "Invalid Link",
    message:
      "This link is invalid or has already been used. If you need to subscribe again, head back home.",
    cta: "Back to Home",
  },
  error: {
    iconBg: "bg-red-500/10",
    iconColor: "text-red-600 dark:text-red-400",
    title: "Something Went Wrong",
    message:
      "We couldn't process your confirmation. Please try again in a moment or contact support.",
    cta: "Back to Home",
  },
};

function StatusIcon({ status, className }: { status: Status; className: string }) {
  if (status === "success" || status === "already-confirmed") {
    return <CheckCircle2 className={className} />;
  }
  if (status === "expired") return <Clock className={className} />;
  if (status === "invalid") return <XCircle className={className} />;
  return <AlertCircle className={className} />;
}

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; status?: string }>;
}) {
  const params = await searchParams;
  const status: Status = params.token
    ? await verifyToken(params.token)
    : (params.status as Status) || "invalid";

  const config = STATUS_CONFIG[status] || STATUS_CONFIG.error;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-foreground/10 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-block">
            <Logo
              titleSize="text-xl sm:text-2xl"
              subtitleSize="text-[0.65rem] sm:text-[0.7rem]"
            />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Card className="p-6 sm:p-8 shadow-lg text-center">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${config.iconBg} mb-5 mx-auto`}
            >
              <StatusIcon status={status} className={`h-8 w-8 ${config.iconColor}`} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-3">
              {config.title}
            </h1>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {config.message}
            </p>

            <Link href="/">
              <Button className="w-full bg-foreground text-background hover:bg-foreground/90">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {config.cta}
              </Button>
            </Link>
          </Card>

          <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-foreground/10">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Responsible Gaming
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  18+ only. Please gamble responsibly. If you need help, visit{" "}
                  <a
                    href="https://www.begambleaware.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    BeGambleAware.org
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
