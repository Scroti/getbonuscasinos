# Affiliate & outbound link policy (internal draft v1)

**Purpose:** One-page house rules for `rel` attributes, disclosures, and claims. **Not legal advice** — your counsel and each network account manager must approve before you rely on this.

**Last updated:** 2026-03-29

---

## 1) How we earn (inventory — fill in)

Check every revenue line and mark **Y/N** for each:

| Channel | We use it? | Notes (program / contract) |
|--------|--------------|-----------------------------|
| Affiliate program (rev share / CPA / hybrid) | | |
| Cost per acquisition (CPA) only | | |
| Media buys / paid placements | | |
| Flat sponsorship / fixed fee for placement | | |
| Free / editorial link (no payment, no tracking deal) | | |

*Add rows as needed. If any row is “yes,” keep evidence (contract, email, network TOC).*

---

## 2) Per-network checklist (repeat for each program)

For **each** network or direct operator deal, record:

- **Required link attribute:** `sponsored` / `nofollow` / both / unspecified (per their current terms).
- **Disclosure:** Where they require copy (e.g. page footer, above fold, per CTA).
- **Restricted claims:** “Best,” guaranteed winnings, unsubstantiated stats, bonus amounts in ads, etc.

*Link to the live program agreement or saved PDF.*

---

## 3) House rule — when we set which `rel`

**Default in product (until you override per URL in CMS):**

| Situation | `rel` on outbound link |
|-----------|-------------------------|
| **Paid, tracked, or commission** (affiliate tag, network redirect, postback, or any compensation on signup/FTD) | `sponsored noopener noreferrer` |
| **Pure editorial:** no commercial agreement, no tracking parameters, no compensation | `noopener noreferrer` |
| **Counsel prefers** editorial links also obscured from passing PageRank | `nofollow noopener noreferrer` (confirm wording with lawyer) |

**Rule of thumb:** If you would invoice or expect payment for that click path, use **`sponsored`**.

---

## 4) Disclosure

- **Site-wide:** Footer affiliate disclosure + link to **How we list offers** (`/how-we-rate`).
- **Networks:** Comply with any *additional* placement or wording they require (e.g. near CTAs).

---

## 5) Sign-off

| Role | Name | Date |
|------|------|------|
| Legal / counsel | | |
| Ops / owner | | |
| Lead affiliate AM (largest program) | | |

---

*After sign-off, store this file in your company drive; keep the repo copy in sync when rules change.*
