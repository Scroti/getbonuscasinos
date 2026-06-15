export function getSiteName(domain: string): string {
  const names: Record<string, string> = {
    "getbonuscasinos.com": "GetBonusCasinos",
    "lucky-heart.com": "Lucky Heart",
    "winbigslots.com": "WinBigSlots",
    "slotisle.com": "SlotIsle",
    "reelslots.org": "ReelSlots",
  };
  return names[domain] || domain;
}

export function normalizeDomain(host: string | null | undefined): string {
  if (!host) return "getbonuscasinos.com";
  return host.replace(/^www\./, "").split(":")[0];
}

export function buildConfirmationEmail({
  siteName,
  confirmUrl,
}: {
  siteName: string;
  confirmUrl: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirm your subscription to ${siteName}</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f13;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f13;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background-color:#18181f;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">

          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed,#db2777);padding:32px;text-align:center;">
              <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">${siteName}</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:36px 32px;text-align:center;">
              <h2 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#f1f1f5;">Confirm your email address</h2>
              <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#a1a1aa;">
                Thanks for subscribing! Click the button below to confirm your email and start receiving exclusive casino bonuses.
              </p>

              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td>
                    <a href="${confirmUrl}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#db2777);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 40px;border-radius:8px;letter-spacing:0.3px;">
                      Confirm Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;font-size:12px;color:#71717a;line-height:1.5;">
                Or copy this link into your browser:<br/>
                <a href="${confirmUrl}" style="color:#a78bfa;text-decoration:underline;word-break:break-all;">${confirmUrl}</a>
              </p>

              <p style="margin:20px 0 0;font-size:12px;color:#71717a;">
                This link expires in 48 hours.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <p style="margin:0;font-size:11px;color:#52525b;">
                If you didn't request this subscription, you can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildWelcomeEmail({
  siteName,
  domain,
}: {
  siteName: string;
  domain: string;
}): string {
  const siteUrl = `https://www.${domain}`;
  const unsubscribeUrl = `${siteUrl}/unsubscribe`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to ${siteName}!</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f13;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f13;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background-color:#18181f;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">

          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed,#db2777);padding:36px 32px;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.7);">Welcome to</p>
              <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">${siteName}</h1>
              <p style="margin:12px 0 0;font-size:15px;color:rgba(255,255,255,0.85);">Your exclusive casino bonus hub</p>
            </td>
          </tr>

          <tr>
            <td style="padding:36px 32px;">
              <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#f1f1f5;">You're in! 🎰</h2>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#a1a1aa;">
                Your subscription is confirmed. You'll be the first to hear about the hottest casino bonuses, exclusive no-deposit offers, and free spins — curated and updated daily.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:4px;">
                    <div style="background-color:#1e1e2a;border:1px solid rgba(124,58,237,0.2);border-radius:10px;padding:16px;">
                      <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#a78bfa;">🎁 Exclusive Bonuses</p>
                      <p style="margin:0;font-size:13px;color:#71717a;">Deals you won't find anywhere else</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px;">
                    <div style="background-color:#1e1e2a;border:1px solid rgba(219,39,119,0.2);border-radius:10px;padding:16px;">
                      <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#f472b6;">⚡ Updated Daily</p>
                      <p style="margin:0;font-size:13px;color:#71717a;">Fresh offers every single day</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px;">
                    <div style="background-color:#1e1e2a;border:1px solid rgba(16,185,129,0.2);border-radius:10px;padding:16px;">
                      <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#34d399;">✅ Verified Operators</p>
                      <p style="margin:0;font-size:13px;color:#71717a;">Only licensed, trusted casinos</p>
                    </div>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${siteUrl}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#db2777);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:8px;letter-spacing:0.3px;">
                      Claim Your Bonus →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <p style="margin:0 0 8px;font-size:11px;color:#52525b;">
                18+ only. Please gamble responsibly. T&amp;Cs apply.
              </p>
              <p style="margin:0;font-size:11px;color:#52525b;">
                You're receiving this because you confirmed your subscription on ${siteName}. &nbsp;
                <a href="${unsubscribeUrl}" style="color:#7c3aed;text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
