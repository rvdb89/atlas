/** Future home for research adapters (web search, source ranking, citation extraction). */
export type ResearchSource = {
  title: string;
  url: string;
  snippet?: string;
  score?: number;
};

export type ResearchQueryResult = {
  topic: string;
  keywords: string[];
  sources: ResearchSource[];
};
