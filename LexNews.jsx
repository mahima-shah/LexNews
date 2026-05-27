import { useState, useRef, useEffect, useCallback } from "react";

// ─── Google Fonts ─────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap";
document.head.appendChild(fontLink);

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  :root {
    --ink: #0a0a0f;
    --ink2: #3a3a4a;
    --muted: #8a8a9a;
    --border: rgba(0,0,0,0.08);
    --surface: #f8f8fa;
    --white: #ffffff;
    --accent: #0a0a0f;
    --red: #e24b4a;
    --font-display: 'Playfair Display', Georgia, serif;
    --font-body: 'DM Sans', system-ui, sans-serif;
  }
  .app { font-family: var(--font-body); color: var(--ink); background: var(--white); width: 390px; height: 844px; overflow: hidden; position: relative; border-radius: 44px; border: 1px solid rgba(0,0,0,0.12); }
  
  /* scrollbar */
  ::-webkit-scrollbar { display: none; }
  * { scrollbar-width: none; }

  /* Feed */
  .feed-scroll { height: 100%; overflow-y: auto; scroll-snap-type: y mandatory; }
  .feed-item { height: 100%; scroll-snap-align: start; flex-shrink: 0; }

  /* Article full screen */
  .article-full { height: 844px; overflow-y: auto; scroll-snap-type: y mandatory; position: relative; background: var(--white); }
  .article-page { min-height: 844px; scroll-snap-align: start; }

  /* Card feed */
  .card-feed { height: 100%; overflow-y: auto; padding: 8px 16px 80px; display: flex; flex-direction: column; gap: 16px; }
  .news-card { background: var(--white); border: 0.5px solid var(--border); border-radius: 16px; overflow: hidden; cursor: pointer; transition: transform 0.15s; }
  .news-card:active { transform: scale(0.98); }
  .card-img { width: 100%; height: 160px; background: linear-gradient(135deg, #f0f0f4 0%, #e8e8ef 100%); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
  .card-img-pattern { position: absolute; inset: 0; opacity: 0.06; }

  /* Tag pills */
  .tag { padding: 3px 9px; border-radius: 4px; font-size: 10px; font-weight: 500; letter-spacing: 0.3px; }
  .tag-dt { background: #EAF3DE; color: #2d6a0d; }
  .tag-it { background: #FEF3E2; color: #92400e; }
  .tag-cl { background: #EFF6FF; color: #1e40af; }
  .tag-gl { background: #F3F0FF; color: #4c1d95; }
  .tag-fy { background: #FFF0F6; color: #9d174d; }

  /* Pill filter */
  .pill { padding: 6px 14px; border-radius: 24px; font-size: 12px; white-space: nowrap; cursor: pointer; border: 0.5px solid #e0e0e8; color: var(--muted); background: var(--white); font-family: var(--font-body); transition: all 0.15s; }
  .pill.on { background: var(--ink); color: #fff; border-color: var(--ink); font-weight: 500; }

  /* Bottom nav */
  .bnav { position: absolute; bottom: 0; left: 0; right: 0; height: 72px; background: rgba(255,255,255,0.96); backdrop-filter: blur(12px); border-top: 0.5px solid var(--border); display: flex; align-items: center; justify-content: space-around; padding: 0 8px 10px; border-radius: 0 0 44px 44px; z-index: 50; }
  .bnav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 6px 10px; background: none; border: none; font-family: var(--font-body); }
  .bnav-label { font-size: 9px; color: var(--muted); letter-spacing: 0.2px; }
  .bnav-label.on { color: var(--ink); font-weight: 500; }
  .fab { width: 48px; height: 48px; background: var(--ink); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-top: -20px; border: 3px solid var(--white); cursor: pointer; }

  /* Topbar */
  .topbar { height: 56px; padding: 0 16px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; background: var(--white); border-bottom: 0.5px solid var(--border); }
  .topbar-logo { display: flex; align-items: center; gap: 7px; }
  .logo-box { width: 28px; height: 28px; background: var(--ink); border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .logo-wordmark { font-family: var(--font-display); font-size: 17px; font-weight: 600; color: var(--ink); letter-spacing: -0.5px; }

  /* Mira sheet */
  .mira-sheet { position: absolute; inset: 0; background: var(--white); z-index: 100; display: flex; flex-direction: column; border-radius: 44px; transform: translateY(100%); transition: transform 0.3s cubic-bezier(0.32,0.72,0,1); }
  .mira-sheet.open { transform: translateY(0); }
  .chat-bubble-bot { background: var(--surface); border-radius: 12px 12px 12px 2px; padding: 10px 13px; font-size: 13px; line-height: 1.55; color: var(--ink); max-width: 86%; align-self: flex-start; }
  .chat-bubble-user { background: var(--ink); border-radius: 12px 12px 2px 12px; padding: 10px 13px; font-size: 13px; line-height: 1.55; color: #fff; max-width: 86%; align-self: flex-end; }

  /* Sign-in gate */
  .gate { position: absolute; inset: 0; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); z-index: 60; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 32px; border-radius: 44px; }

  /* Full article reader */
  .reader-wrap { position: absolute; inset: 0; z-index: 40; background: var(--white); transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.32,0.72,0,1); border-radius: 44px; overflow: hidden; }
  .reader-wrap.open { transform: translateY(0); }
  .reader-slides { height: 844px; overflow-y: auto; scroll-snap-type: y mandatory; }
  .reader-slide { height: 844px; scroll-snap-align: start; overflow-y: auto; position: relative; background: var(--white); display: flex; flex-direction: column; }

  /* Animations */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fadeUp 0.35s ease forwards; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Search */
  .search-input-wrap { background: var(--surface); border: 0.5px solid var(--border); border-radius: 12px; padding: 9px 14px; display: flex; align-items: center; gap: 9px; }
  .search-input-wrap input { flex: 1; background: transparent; border: none; outline: none; font-size: 14px; font-family: var(--font-body); color: var(--ink); }

  /* Settings rows */
  .settings-row { display: flex; align-items: center; gap: 12px; padding: 13px 0; border-bottom: 0.5px solid var(--border); cursor: pointer; }
  .settings-row:last-child { border-bottom: none; }
`;
const styleEl = document.createElement("style");
styleEl.textContent = css;
document.head.appendChild(styleEl);

// ─── Data ─────────────────────────────────────────────────────────────────────
const ARTICLES = [
  {
    id: 1, cat: "dt", forYou: true,
    title: "CBDT clarifies TDS on VDA transfers between exchanges",
    subtitle: "No Section 194S liability on inter-exchange crypto moves, circular effective June 1",
    date: "May 27, 2026", readTime: "3 min read",
    tag: "Direct Tax", tagStyle: "tag-dt",
    imgColor: "#e8f4e8", imgAccent: "#3B6D11",
    body: `The Central Board of Direct Taxes issued Circular No. 8/2026 clarifying that Section 194S TDS obligations do not arise on transfers of virtual digital assets between two registered exchanges where no monetary consideration is received by the transferor.

The circular addresses widespread ambiguity that had emerged after the Finance Act 2022 introduced Section 194S. Many exchanges had been deducting TDS conservatively on all VDA movements, including internal portfolio rebalancing and inter-exchange arbitrage transfers, resulting in significant cash flow disruptions for traders.

Key clarifications include: (1) TDS applies only when consideration is "received" as defined under Section 194S — mere book entries do not qualify; (2) Exchanges must maintain comprehensive transfer logs for a minimum of 7 years for audit purposes; (3) The exemption does not extend to peer-to-peer transfers or transfers to unregistered overseas platforms.

The circular takes effect from June 1, 2026, and applies prospectively. Taxpayers who deducted TDS on exempt transfers may apply for refund under Section 239.`,
    sources: [
      { name: "Economic Times", url: "https://economictimes.indiatimes.com", time: "2h ago" },
      { name: "Live Law", url: "https://livelaw.in", time: "3h ago" },
      { name: "CBDT Official Circular", url: "https://incometax.gov.in", time: "5h ago" },
      { name: "Taxmann", url: "https://taxmann.com", time: "6h ago" },
    ],
  },
  {
    id: 2, cat: "it", forYou: true,
    title: "Supreme Court upholds GSTN power to block ITC under Rule 86A",
    subtitle: "Three-judge bench rules provisional blocking of input tax credit does not violate fundamental rights",
    date: "May 27, 2026", readTime: "4 min read",
    tag: "Indirect Tax", tagStyle: "tag-it",
    imgColor: "#fef3e2", imgAccent: "#92400e",
    body: `A three-judge bench of the Supreme Court, in Union of India v. M/s Apex Traders (2026), held that the GST Network's authority under Rule 86A of the CGST Rules to provisionally block input tax credit ledgers where mismatches are detected does not violate Article 19(1)(g) of the Constitution.

The court held that the right to carry on trade does not include the right to utilize credits that are disputed by the revenue authorities. However, the bench struck down the practice of indefinite blocking without adjudication, directing that blocked amounts must be adjudicated within 90 days of the blocking order.

The judgment further clarified that blocking orders must be reasoned and served on the taxpayer within 24 hours of being made. Any blocking that persists beyond 90 days without a show-cause notice stands automatically vacated.

This ruling is expected to impact approximately 45,000 taxpayers whose ITC is currently under provisional block, with combined disputed credit of approximately ₹38,000 crore.`,
    sources: [
      { name: "Live Law", url: "https://livelaw.in", time: "5h ago" },
      { name: "Bar & Bench", url: "https://barandbench.com", time: "6h ago" },
      { name: "SCC Online", url: "https://scconline.com", time: "7h ago" },
      { name: "Financial Express", url: "https://financialexpress.com", time: "8h ago" },
    ],
  },
  {
    id: 3, cat: "cl", forYou: false,
    title: "SEBI mandates real-time insider trading disclosures via new LODR amendment",
    subtitle: "Listed company insiders must now disclose trades within 2 hours, down from 2 days",
    date: "May 26, 2026", readTime: "3 min read",
    tag: "Corporate", tagStyle: "tag-cl",
    imgColor: "#eff6ff", imgAccent: "#1e40af",
    body: `The Securities and Exchange Board of India has amended the LODR Regulations requiring designated persons at listed entities to disclose trades in securities of their own company within 2 trading hours, significantly down from the existing 2-day disclosure window.

The amendment, effective July 1, 2026, targets algorithmic front-running where sophisticated market participants had been exploiting the 2-day lag to position themselves ahead of mandatory disclosures. SEBI's market surveillance systems had flagged over 200 instances of suspected front-running in FY 2025-26.

The new rule applies to all designated persons as defined under the SEBI (Prohibition of Insider Trading) Regulations, 2015, including directors, key managerial personnel, and their immediate relatives.

Companies must upgrade their compliance management systems to support automated real-time disclosure filing via the new SEBI SCORES 2.0 portal. SEBI has indicated a 3-month grace period for technical implementation but zero tolerance for non-disclosure after October 1, 2026.`,
    sources: [
      { name: "SEBI Circular", url: "https://sebi.gov.in", time: "Yesterday" },
      { name: "Mint", url: "https://livemint.com", time: "Yesterday" },
      { name: "Business Standard", url: "https://business-standard.com", time: "Yesterday" },
    ],
  },
  {
    id: 4, cat: "gl", forYou: false,
    title: "Delhi HC stays Arbitration Act amendment — retrospective application ruled unconstitutional",
    subtitle: "Court holds legislative interference in pending arbitral proceedings violates natural justice",
    date: "May 26, 2026", readTime: "5 min read",
    tag: "General Law", tagStyle: "tag-gl",
    imgColor: "#f3f0ff", imgAccent: "#4c1d95",
    body: `The Delhi High Court issued an interim stay on Section 12A of the Arbitration and Conciliation (Amendment) Act 2025, holding that its retrospective application to pending arbitral proceedings violates principles of natural justice and constitutes impermissible legislative interference in judicial proceedings.

The single-bench order, passed in Reliance Infrastructure Ltd. v. Union of India, held that parties who had already constituted arbitral tribunals and expended significant resources in proceedings cannot have the rules of the game changed mid-way by legislative fiat.

The court distinguished between procedural amendments (which may apply retrospectively) and amendments that affect the jurisdiction or composition of the tribunal (which cannot). Section 12A's expansion of grounds for challenging arbitrator impartiality falls in the second category.

The Union of India has been directed to file a counter-affidavit within four weeks. The matter has been listed for hearing before a division bench on July 14, 2026. Legal experts estimate the stay affects over 3,000 pending arbitration proceedings.`,
    sources: [
      { name: "Bar & Bench", url: "https://barandbench.com", time: "Yesterday" },
      { name: "Indian Express Legal", url: "https://indianexpress.com", time: "Yesterday" },
      { name: "SCC Online", url: "https://scconline.com", time: "2 days ago" },
    ],
  },
  {
    id: 5, cat: "dt", forYou: true,
    title: "Income Tax Dept launches Project Insight 2.0 for foreign asset cross-referencing",
    subtitle: "AI platform to match Schedule FA disclosures with FATCA and CRS data from 112 countries",
    date: "May 25, 2026", readTime: "4 min read",
    tag: "Direct Tax", tagStyle: "tag-dt",
    imgColor: "#e8f4e8", imgAccent: "#3B6D11",
    body: `The Income Tax Department has operationalised Project Insight 2.0, an enhanced AI-powered data analytics platform that cross-matches Schedule FA (Foreign Assets) disclosures in Income Tax Returns with information received under FATCA and CRS agreements from 112 countries.

The platform uses machine learning to identify discrepancies between self-reported foreign assets and information received from foreign tax authorities, financial intelligence units, and treaty partners. Initial runs have identified approximately 12,000 high-risk cases where there are material differences between disclosed and reported information.

Non-disclosure notices under Section 10(23C) and prosecution referrals under the Black Money (Undisclosed Foreign Income and Assets) Act are expected to commence from June 2026. The department has indicated that voluntary disclosure under the updated VDS window, open until May 31, 2026, will be treated more leniently.

Tax practitioners are advising clients to review their FY 2024-25 ITRs before filing to ensure all foreign accounts, investments in foreign entities, and beneficial ownership interests are correctly disclosed in Schedule FA and Schedule FSI.`,
    sources: [
      { name: "Hindu Business Line", url: "https://thehindubusinessline.com", time: "2 days ago" },
      { name: "Taxmann", url: "https://taxmann.com", time: "2 days ago" },
      { name: "Financial Express", url: "https://financialexpress.com", time: "2 days ago" },
    ],
  },
  {
    id: 6, cat: "it", forYou: true,
    title: "GST Council to consider amnesty scheme for FY 2017-20 demands",
    subtitle: "Settlement at 30% of disputed tax and 50% of interest proposed to clear 45,000 pending cases",
    date: "May 25, 2026", readTime: "3 min read",
    tag: "Indirect Tax", tagStyle: "tag-it",
    imgColor: "#fef3e2", imgAccent: "#92400e",
    body: `The 54th GST Council is deliberating an amnesty window for contested demands from the first three years of GST implementation (FY 2017-18 to FY 2019-20). Under the proposed scheme, taxpayers can settle by paying 30% of the disputed principal tax amount along with 50% of the accrued interest, with all penalties and remaining interest being waived.

The scheme has been prompted by the massive backlog at GST appellate authorities and the anticipated operational capacity of GSTAT (GST Appellate Tribunal), which is expected to become functional from October 2026. Without an amnesty, GSTAT is estimated to be overwhelmed from day one.

Revenue Secretary has indicated the scheme will be open for a 90-day window and is expected to recover approximately ₹15,000 crore in revenue while clearing the decks for GSTAT. Industries with the highest disputed demands include construction, logistics, telecom, and financial services.

A formal circular is expected to be released before June 30, 2026. Taxpayers with pending show-cause notices, adjudication orders, and appellate orders up to the Commissioner (Appeals) level will be eligible.`,
    sources: [
      { name: "Economic Times", url: "https://economictimes.com", time: "2 days ago" },
      { name: "CNBC TV18", url: "https://cnbctv18.com", time: "2 days ago" },
      { name: "Mint", url: "https://livemint.com", time: "3 days ago" },
    ],
  },
];

const TAG_COLORS = { "tag-dt": ["#EAF3DE","#2d6a0d"], "tag-it": ["#FEF3E2","#92400e"], "tag-cl": ["#EFF6FF","#1e40af"], "tag-gl": ["#F3F0FF","#4c1d95"], "tag-fy": ["#FFF0F6","#9d174d"] };

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ic = {
  Home: ({c="currentColor",s=22}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Search: ({c="currentColor",s=22}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Mira: ({c="currentColor",s=22}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Bookmark: ({c="currentColor",s=20,fill="none"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  User: ({c="currentColor",s=22}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Bell: ({c="currentColor",s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Share: ({c="currentColor",s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  More: ({c="currentColor",s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1" fill={c}/><circle cx="12" cy="12" r="1" fill={c}/><circle cx="12" cy="19" r="1" fill={c}/></svg>,
  Back: ({c="currentColor",s=22}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  External: ({c="currentColor",s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  Close: ({c="currentColor",s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Up: ({c="currentColor",s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
  Clock: ({c="currentColor",s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Chevron: ({c="currentColor",s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Edit: ({c="currentColor",s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Logout: ({c="currentColor",s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Settings: ({c="currentColor",s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Help: ({c="currentColor",s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Tag: ({c="currentColor",s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
};

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <div className="topbar-logo">
      <div className="logo-box">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3,3 9,8 3,13"/>
          <polyline points="8,3 14,8 8,13"/>
        </svg>
      </div>
      <span className="logo-wordmark">LexNews</span>
    </div>
  );
}

// ─── Article Image Placeholder ────────────────────────────────────────────────
function ArticleImage({ article, height = 200, style = {} }) {
  const patternId = `p${article.id}`;
  return (
    <div style={{ width: "100%", height, background: article.imgColor, position: "relative", overflow: "hidden", flexShrink: 0, ...style }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12 }} viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={patternId} width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1.5" fill={article.imgAccent}/>
            <line x1="0" y1="20" x2="40" y2="20" stroke={article.imgAccent} strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="400" height="200" fill={`url(#${patternId})`}/>
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6 }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 13, color: article.imgAccent, opacity: 0.6, fontWeight: 500 }}>Article Image</span>
      </div>
    </div>
  );
}

// ─── Tag Pill ─────────────────────────────────────────────────────────────────
function Tag({ article }) {
  const [bg, fg] = TAG_COLORS[article.tagStyle] || ["#f0f0f0", "#444"];
  return <span style={{ padding: "3px 9px", borderRadius: 4, fontSize: 10, fontWeight: 500, letterSpacing: 0.3, background: bg, color: fg }}>{article.tag}</span>;
}

// ─── Full-screen Article Reader ───────────────────────────────────────────────
function ArticleReader({ articles, startIndex, onClose, savedIds, onSave }) {
  const slidesRef = useRef(null);

  useEffect(() => {
    if (slidesRef.current) {
      slidesRef.current.scrollTop = startIndex * 844;
    }
  }, [startIndex]);

  return (
    <div className="reader-slides" ref={slidesRef}>
      {articles.map((article, i) => (
        <ReaderSlide key={article.id} article={article} onClose={onClose} saved={savedIds.includes(article.id)} onSave={onSave} isLast={i === articles.length - 1} />
      ))}
    </div>
  );
}

function ReaderSlide({ article, onClose, saved, onSave, isLast }) {
  return (
    <div className="reader-slide">
      {/* Back button */}
      <div style={{ position: "absolute", top: 16, left: 16, zIndex: 10 }}>
        <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.92)", border: "0.5px solid rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Ic.Back s={18} c="#0a0a0f"/>
        </button>
      </div>
      {/* Actions top-right */}
      <div style={{ position: "absolute", top: 16, right: 16, zIndex: 10, display: "flex", gap: 8 }}>
        <button onClick={() => onSave(article.id)} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.92)", border: "0.5px solid rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Ic.Bookmark s={18} c={saved ? "#0a0a0f" : "#8a8a9a"} fill={saved ? "#0a0a0f" : "none"}/>
        </button>
        <button style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.92)", border: "0.5px solid rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Ic.Share s={18} c="#8a8a9a"/>
        </button>
        <button style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.92)", border: "0.5px solid rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Ic.More s={18} c="#8a8a9a"/>
        </button>
      </div>

      {/* Hero Image */}
      <ArticleImage article={article} height={280}/>

      {/* Content scroll */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 0 100px" }}>
        <div style={{ padding: "18px 20px 0" }}>
          <Tag article={article}/>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--ink)", lineHeight: 1.3, marginTop: 10, marginBottom: 6 }}>{article.title}</h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>{article.date} · {article.readTime}</p>
          <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.75, whiteSpace: "pre-line", marginBottom: 24 }}>{article.body}</p>

          {/* Sources */}
          <div style={{ borderTop: "0.5px solid var(--border)", paddingTop: 16, marginBottom: 24 }}>
            <p style={{ fontSize: 10, color: "var(--muted)", fontWeight: 500, letterSpacing: 0.5, marginBottom: 10 }}>SOURCES ({article.sources.length})</p>
            {article.sources.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: i < article.sources.length - 1 ? "0.5px solid var(--border)" : "none", textDecoration: "none" }}>
                <Ic.External c="#185FA5"/>
                <span style={{ fontSize: 12, color: "#185FA5", flex: 1 }}>{s.name}</span>
                <span style={{ fontSize: 10, color: "var(--muted)" }}>{s.time}</span>
              </a>
            ))}
          </div>

          {/* Swipe hint */}
          {!isLast && (
            <div style={{ textAlign: "center", paddingBottom: 8 }}>
              <p style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 0.3 }}>Swipe up for next article</p>
              <div style={{ marginTop: 6, display: "flex", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" style={{ animation: "none" }}/>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── News Card (feed) ─────────────────────────────────────────────────────────
function NewsCard({ article, onClick, saved, onSave }) {
  return (
    <div className="news-card" onClick={onClick} style={{ animationDelay: "0.05s" }}>
      <ArticleImage article={article} height={160}/>
      <div style={{ padding: "12px 14px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <Tag article={article}/>
          <span style={{ fontSize: 10, color: "var(--muted)" }}>{article.date} · {article.readTime}</span>
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "var(--ink)", lineHeight: 1.35, marginBottom: 4 }}>{article.title}</h3>
        <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, marginBottom: 10 }}>{article.subtitle}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 14, padding: "8px 14px", borderTop: "0.5px solid var(--border)" }} onClick={e => e.stopPropagation()}>
        <button onClick={() => onSave(article.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}>
          <Ic.Bookmark s={18} c={saved ? "#0a0a0f" : "#8a8a9a"} fill={saved ? "#0a0a0f" : "none"}/>
        </button>
        <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}>
          <Ic.Share s={18} c="#8a8a9a"/>
        </button>
        <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}>
          <Ic.More s={18} c="#8a8a9a"/>
        </button>
      </div>
      <div style={{ padding: "0 14px 12px" }}>
        <p style={{ fontSize: 10, color: "var(--muted)", fontWeight: 500, letterSpacing: 0.4, marginBottom: 5 }}>SOURCES ({article.sources.length})</p>
        {article.sources.slice(0, 2).map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 0" }}>
            <Ic.External c="#9ca3af"/>
            <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#185FA5", textDecoration: "none" }} onClick={e => e.stopPropagation()}>{s.name}</a>
            <span style={{ fontSize: 10, color: "var(--muted)", marginLeft: "auto" }}>{s.time}</span>
          </div>
        ))}
        {article.sources.length > 2 && <p style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>+{article.sources.length - 2} more</p>}
      </div>
    </div>
  );
}

// ─── Sign-in Gate ─────────────────────────────────────────────────────────────
function SignInGate({ message, onSignIn, onDismiss }) {
  return (
    <div className="gate">
      <div style={{ width: 56, height: 56, background: "var(--ink)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
        <svg width="24" height="24" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3,3 9,8 3,13"/><polyline points="8,3 14,8 8,13"/>
        </svg>
      </div>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--ink)", textAlign: "center" }}>Sign in to LexNews</p>
      <p style={{ fontSize: 13, color: "var(--muted)", textAlign: "center", lineHeight: 1.6 }}>{message}</p>
      <button onClick={onSignIn} style={{ width: "100%", padding: "13px 0", background: "var(--ink)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-body)", marginTop: 8 }}>
        Sign in
      </button>
      <button onClick={onDismiss} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "var(--muted)", fontFamily: "var(--font-body)", padding: "6px 0" }}>
        Continue without signing in
      </button>
    </div>
  );
}

// ─── Mira Panel ───────────────────────────────────────────────────────────────
function MiraPanel({ open, onClose }) {
  const [msgs, setMsgs] = useState([{ role: "bot", text: "Hi, I'm Mira — your legal AI. Ask me anything about Indian tax law, corporate compliance, or recent judgments." }]);
  const [input, setInput] = useState("");
  const areaRef = useRef(null);

  const send = () => {
    if (!input.trim()) return;
    const q = input;
    setMsgs(m => [...m, { role: "user", text: q }, { role: "bot", text: "Let me look into that for you…" }]);
    setInput("");
    setTimeout(() => { if (areaRef.current) areaRef.current.scrollTop = areaRef.current.scrollHeight; }, 50);
  };

  return (
    <div className={`mira-sheet ${open ? "open" : ""}`}>
      <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "0.5px solid var(--border)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div className="logo-box" style={{ width: 30, height: 30, borderRadius: 8 }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3,3 9,8 3,13"/><polyline points="8,3 14,8 8,13"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)", margin: 0 }}>Mira</p>
            <p style={{ fontSize: 10, color: "var(--muted)", margin: 0 }}>Legal AI by LexNews</p>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
          <Ic.Close c="var(--muted)"/>
        </button>
      </div>
      <div ref={areaRef} style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} className={m.role === "bot" ? "chat-bubble-bot" : "chat-bubble-user"}>{m.text}</div>
        ))}
      </div>
      <div style={{ padding: "10px 14px 20px", borderTop: "0.5px solid var(--border)", flexShrink: 0 }}>
        <div style={{ background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: 24, padding: "9px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask Mira anything…" style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, fontFamily: "var(--font-body)", color: "var(--ink)" }}/>
          <button onClick={send} style={{ width: 32, height: 32, background: "var(--ink)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", flexShrink: 0 }}>
            <Ic.Up c="#fff" s={14}/>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
function BottomNav({ active, onNavigate }) {
  const items = [
    { id: "home", label: "Home", Icon: Ic.Home },
    { id: "search", label: "Search", Icon: Ic.Search },
    { id: "mira", label: "Mira", fab: true },
    { id: "saved", label: "Saved", Icon: Ic.Bookmark },
    { id: "profile", label: "Profile", Icon: Ic.User },
  ];
  return (
    <div className="bnav">
      {items.map(item => {
        const on = active === item.id;
        if (item.fab) return (
          <button key="mira" className="fab" onClick={() => onNavigate("mira")} aria-label="Ask Mira">
            <Ic.Mira c="#fff" s={22}/>
          </button>
        );
        return (
          <button key={item.id} className="bnav-item" onClick={() => onNavigate(item.id)}>
            <item.Icon c={on ? "#0a0a0f" : "#c0c0cc"} s={22}/>
            <span className={`bnav-label ${on ? "on" : ""}`}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────
function HomeScreen({ onNavigate, savedIds, onSave, isSignedIn, onNeedSignIn }) {
  const [cat, setCat] = useState("fy");
  const [readerOpen, setReaderOpen] = useState(false);
  const [readerArticles, setReaderArticles] = useState([]);
  const [readerStart, setReaderStart] = useState(0);

  const FILTERS = [
    { label: "For you", cat: "fy" },
    { label: "All", cat: "all" },
    { label: "Direct Tax", cat: "dt" },
    { label: "Indirect Tax", cat: "it" },
    { label: "Corporate", cat: "cl" },
    { label: "General Law", cat: "gl" },
  ];

  const filtered = cat === "fy" ? ARTICLES.filter(a => a.forYou) : cat === "all" ? ARTICLES : ARTICLES.filter(a => a.cat === cat);

  const openReader = (idx) => { setReaderArticles(filtered); setReaderStart(idx); setReaderOpen(true); };
  const handleSave = (id) => { if (!isSignedIn) { onNeedSignIn(); return; } onSave(id); };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      <div className="topbar">
        <Logo/>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Ic.Bell c="#8a8a9a" s={20}/>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#f3e8ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: "#6d28d9", cursor: "pointer" }} onClick={() => onNavigate("profile")}>
            {isSignedIn ? "MS" : <Ic.User c="#6d28d9" s={16}/>}
          </div>
        </div>
      </div>
      <div style={{ padding: "10px 0 0 16px", display: "flex", gap: 6, overflowX: "auto", flexShrink: 0, scrollbarWidth: "none" }}>
        {FILTERS.map(f => (
          <button key={f.cat} className={`pill ${cat === f.cat ? "on" : ""}`} onClick={() => { if (f.cat === "fy" && !isSignedIn) { onNeedSignIn(); return; } setCat(f.cat); }}>
            {f.label}
            {f.cat === "fy" && !isSignedIn && <span style={{ marginLeft: 4, opacity: 0.5 }}>🔒</span>}
          </button>
        ))}
      </div>
      <div className="card-feed" style={{ paddingTop: 12 }}>
        {filtered.map((a, i) => <NewsCard key={a.id} article={a} onClick={() => openReader(i)} saved={savedIds.includes(a.id)} onSave={handleSave}/>)}
      </div>
      <BottomNav active="home" onNavigate={onNavigate}/>

      {/* Reader overlay */}
      <div className={`reader-wrap ${readerOpen ? "open" : ""}`}>
        {readerOpen && <ArticleReader articles={readerArticles} startIndex={readerStart} onClose={() => setReaderOpen(false)} savedIds={savedIds} onSave={handleSave}/>}
      </div>
    </div>
  );
}

// ─── Search Screen ────────────────────────────────────────────────────────────
const RECENT = ["Section 194S TDS crypto", "GST ITC mismatch circular", "SEBI insider trading 2026", "Companies Act Section 135", "Supreme Court income tax"];
const TRENDING_TAGS = [
  { label: "VDA taxation", style: "tag-dt" }, { label: "GST amnesty", style: "tag-it" },
  { label: "SEBI circular", style: "tag-cl" }, { label: "NCLT ruling", style: "tag-gl" },
  { label: "Transfer pricing", style: "" }, { label: "FEMA 2026", style: "" },
];

function SearchScreen({ onNavigate }) {
  const [q, setQ] = useState("");
  const [recents, setRecents] = useState(RECENT);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div className="topbar"><Logo/><div style={{ display: "flex", gap: 12 }}><Ic.Bell c="#8a8a9a" s={20}/></div></div>
      <div style={{ padding: "12px 16px 0", flexShrink: 0 }}>
        <div className="search-input-wrap">
          <Ic.Search c="#c0c0cc" s={18}/>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search cases, acts, keywords…"/>
          {q && <button onClick={() => setQ("")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><Ic.Close c="#c0c0cc" s={16}/></button>}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 0 80px" }}>
        <p style={{ fontSize: 10, color: "var(--muted)", padding: "14px 16px 6px", fontWeight: 500, letterSpacing: 0.5 }}>RECENT SEARCHES</p>
        <div style={{ padding: "0 16px" }}>
          {recents.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "0.5px solid var(--border)" }}>
              <Ic.Clock c="#c0c0cc" s={16}/>
              <span style={{ fontSize: 13, color: "var(--ink)", flex: 1 }}>{r}</span>
              <button onClick={() => setRecents(x => x.filter((_,j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
                <Ic.Close c="#d0d0dd" s={14}/>
              </button>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 10, color: "var(--muted)", padding: "16px 16px 8px", fontWeight: 500, letterSpacing: 0.5 }}>TRENDING TOPICS</p>
        <div style={{ padding: "0 16px", display: "flex", flexWrap: "wrap", gap: 7 }}>
          {TRENDING_TAGS.map((t, i) => {
            const [bg, fg] = TAG_COLORS[t.style] || ["#f0f0f4", "#5a5a6a"];
            return <span key={i} style={{ padding: "5px 12px", borderRadius: 20, fontSize: 12, background: bg, color: fg, cursor: "pointer" }}>{t.label}</span>;
          })}
        </div>
      </div>
      <BottomNav active="search" onNavigate={onNavigate}/>
    </div>
  );
}

// ─── Saved Screen ─────────────────────────────────────────────────────────────
function SavedScreen({ onNavigate, savedIds, onSave, isSignedIn, onNeedSignIn }) {
  const [cat, setCat] = useState("all");
  const [readerOpen, setReaderOpen] = useState(false);
  const [readerStart, setReaderStart] = useState(0);
  const [readerArticles, setReaderArticles] = useState([]);
  const saved = ARTICLES.filter(a => savedIds.includes(a.id));
  const filtered = cat === "all" ? saved : saved.filter(a => a.cat === cat);
  const FILTERS = [{ label: "All", cat: "all" }, { label: "Direct Tax", cat: "dt" }, { label: "Indirect Tax", cat: "it" }, { label: "Corporate", cat: "cl" }, { label: "General Law", cat: "gl" }];
  const openReader = (idx) => { setReaderArticles(filtered); setReaderStart(idx); setReaderOpen(true); };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      <div className="topbar"><Logo/><div style={{ display: "flex", gap: 12 }}><Ic.Bell c="#8a8a9a" s={20}/></div></div>
      <div style={{ padding: "10px 0 0 16px", display: "flex", gap: 6, overflowX: "auto", flexShrink: 0 }}>
        {FILTERS.map(f => <button key={f.cat} className={`pill ${cat === f.cat ? "on" : ""}`} onClick={() => setCat(f.cat)}>{f.label}</button>)}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 16px 80px", display: "flex", flexDirection: "column", gap: 16 }}>
        {!isSignedIn ? (
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <div style={{ width: 56, height: 56, background: "var(--surface)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Ic.Bookmark c="#c0c0cc" s={24}/>
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--ink)", marginBottom: 6 }}>Sign in to save articles</p>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>Your saved articles will appear here</p>
            <button onClick={onNeedSignIn} style={{ padding: "11px 28px", background: "var(--ink)", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-body)" }}>Sign in</button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>No saved articles yet</p>
          </div>
        ) : filtered.map((a, i) => <NewsCard key={a.id} article={a} onClick={() => openReader(i)} saved={savedIds.includes(a.id)} onSave={onSave}/>)}
      </div>
      <BottomNav active="saved" onNavigate={onNavigate}/>
      <div className={`reader-wrap ${readerOpen ? "open" : ""}`}>
        {readerOpen && <ArticleReader articles={readerArticles} startIndex={readerStart} onClose={() => setReaderOpen(false)} savedIds={savedIds} onSave={onSave}/>}
      </div>
    </div>
  );
}

// ─── Profile Screen ───────────────────────────────────────────────────────────
function ProfileScreen({ onNavigate, isSignedIn, onSignIn, onSignOut }) {
  if (!isSignedIn) {
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div className="topbar"><Logo/></div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 12 }}>
          <div style={{ width: 64, height: 64, background: "var(--ink)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
            <svg width="28" height="28" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3,3 9,8 3,13"/><polyline points="8,3 14,8 8,13"/>
            </svg>
          </div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--ink)", textAlign: "center" }}>Welcome to LexNews</p>
          <p style={{ fontSize: 13, color: "var(--muted)", textAlign: "center", lineHeight: 1.6 }}>Sign in to save articles, set your feed preferences, and get personalised legal news.</p>
          <button onClick={onSignIn} style={{ width: "100%", padding: "13px 0", background: "var(--ink)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-body)", marginTop: 8 }}>Sign in</button>
          <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center" }}>You can browse LexNews without signing in. Create an account to unlock saved articles and personalised feed.</p>
        </div>
        <BottomNav active="profile" onNavigate={onNavigate}/>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div className="topbar"><Logo/></div>
      <div style={{ padding: "16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "0.5px solid var(--border)", flexShrink: 0 }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#f3e8ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 500, color: "#6d28d9" }}>MS</div>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, color: "var(--ink)", margin: 0 }}>Mahima Shah</p>
          <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>mahima@taxchambers.in</p>
        </div>
        <button style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", display: "flex" }}>
          <Ic.Edit c="var(--muted)" s={18}/>
        </button>
      </div>
      <div style={{ display: "flex", borderBottom: "0.5px solid var(--border)", flexShrink: 0 }}>
        {[["24", "Saved"], ["148", "Read"], ["12", "Mira chats"]].map(([n, l], i) => (
          <div key={i} style={{ flex: 1, padding: "12px 0", textAlign: "center", borderRight: i < 2 ? "0.5px solid var(--border)" : "none" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--ink)", margin: 0 }}>{n}</p>
            <p style={{ fontSize: 10, color: "var(--muted)", margin: 0 }}>{l}</p>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 80px" }}>
        {[
          { section: "PREFERENCES", items: [
            { Icon: Ic.Settings, label: "Feed preferences", note: "Direct Tax, Indirect Tax" },
            { Icon: Ic.Bell, label: "Notifications" },
            { Icon: Ic.Tag, label: "Manage topics" },
          ]},
          { section: "MIRA", items: [
            { Icon: Ic.Mira, label: "Mira chat history" },
          ]},
          { section: "ACCOUNT", items: [
            { Icon: Ic.Help, label: "Help & support" },
            { Icon: Ic.Logout, label: "Sign out", danger: true, action: onSignOut },
          ]},
        ].map(group => (
          <div key={group.section}>
            <p style={{ fontSize: 10, color: "var(--muted)", padding: "14px 0 4px", fontWeight: 500, letterSpacing: 0.5 }}>{group.section}</p>
            {group.items.map((item, i) => (
              <div key={i} className="settings-row" onClick={item.action}>
                <item.Icon c={item.danger ? "var(--red)" : "var(--muted)"} s={18}/>
                <span style={{ fontSize: 13, color: item.danger ? "var(--red)" : "var(--ink)", flex: 1 }}>{item.label}</span>
                {item.note && <span style={{ fontSize: 11, color: "var(--muted)" }}>{item.note}</span>}
                {!item.danger && <Ic.Chevron c="#d0d0dd"/>}
              </div>
            ))}
          </div>
        ))}
      </div>
      <BottomNav active="profile" onNavigate={onNavigate}/>
    </div>
  );
}

// ─── Sign In Modal ────────────────────────────────────────────────────────────
function SignInModal({ onSuccess, onCancel }) {
  const [name, setName] = useState("Mahima Shah");
  const [email, setEmail] = useState("mahima@taxchambers.in");
  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "flex-end", borderRadius: 44 }}>
      <div style={{ background: "#fff", borderRadius: "28px 28px 44px 44px", padding: "28px 24px 40px", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--ink)" }}>Sign in</p>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer" }}><Ic.Close c="var(--muted)" s={20}/></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500, letterSpacing: 0.3 }}>FULL NAME</label>
            <input value={name} onChange={e => setName(e.target.value)} style={{ display: "block", width: "100%", marginTop: 6, padding: "11px 14px", background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: 10, fontSize: 14, fontFamily: "var(--font-body)", color: "var(--ink)", outline: "none" }}/>
          </div>
          <div>
            <label style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500, letterSpacing: 0.3 }}>EMAIL</label>
            <input value={email} onChange={e => setEmail(e.target.value)} style={{ display: "block", width: "100%", marginTop: 6, padding: "11px 14px", background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: 10, fontSize: 14, fontFamily: "var(--font-body)", color: "var(--ink)", outline: "none" }}/>
          </div>
          <button onClick={() => onSuccess({ name, email })} style={{ width: "100%", padding: "13px 0", background: "var(--ink)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-body)", marginTop: 6 }}>
            Continue
          </button>
          <p style={{ fontSize: 11, color: "var(--muted)", textAlign: "center" }}>By continuing you agree to LexNews Terms & Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [savedIds, setSavedIds] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [miraOpen, setMiraOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [gateMsg, setGateMsg] = useState("");

  const toggleSave = (id) => setSavedIds(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const handleNeedSignIn = (msg = "Sign in to save articles and personalise your feed.") => {
    setGateMsg(msg);
    setShowSignIn(true);
  };

  const handleNav = (id) => {
    if (id === "mira") { setMiraOpen(true); return; }
    setScreen(id);
  };

  const handleSignInSuccess = () => { setIsSignedIn(true); setShowSignIn(false); };

  return (
    <div className="app">
      {screen === "home"    && <HomeScreen    onNavigate={handleNav} savedIds={savedIds} onSave={toggleSave} isSignedIn={isSignedIn} onNeedSignIn={() => handleNeedSignIn()}/>}
      {screen === "search"  && <SearchScreen  onNavigate={handleNav}/>}
      {screen === "saved"   && <SavedScreen   onNavigate={handleNav} savedIds={savedIds} onSave={toggleSave} isSignedIn={isSignedIn} onNeedSignIn={() => handleNeedSignIn("Sign in to save and access your articles.")}/>}
      {screen === "profile" && <ProfileScreen onNavigate={handleNav} isSignedIn={isSignedIn} onSignIn={() => setShowSignIn(true)} onSignOut={() => setIsSignedIn(false)}/>}

      <MiraPanel open={miraOpen} onClose={() => setMiraOpen(false)}/>

      {showSignIn && <SignInModal onSuccess={handleSignInSuccess} onCancel={() => setShowSignIn(false)}/>}
    </div>
  );
}
