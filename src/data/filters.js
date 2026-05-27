export const ARTICLE_FILTERS = [
  { label: "For you", cat: "fy" },
  { label: "All", cat: "all" },
  { label: "Direct Tax", cat: "dt" },
  { label: "Indirect Tax", cat: "it" },
  { label: "Corporate", cat: "cl" },
  { label: "General Law", cat: "gl" },
];

export const SAVED_FILTERS = ARTICLE_FILTERS.filter((filter) => filter.cat !== "fy");

export const RECENT_SEARCHES = [
  "Section 194S TDS crypto",
  "GST ITC mismatch circular",
  "SEBI insider trading 2026",
  "Companies Act Section 135",
  "Supreme Court income tax",
];

export const TRENDING_TOPICS = [
  "VDA taxation",
  "GST amnesty",
  "SEBI circular",
  "NCLT ruling",
  "Transfer pricing",
  "FEMA 2026",
];
