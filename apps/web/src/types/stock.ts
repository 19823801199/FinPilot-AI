export interface StockSearchResult {
  code: string;
  name: string;
  exchange: string;
  industry: string;
  marketCap?: string;
}

export interface StockDetail {
  code: string;
  name: string;
  exchange: string;
  industry: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  pe?: number;
  pb?: number;
  high52w?: number;
  low52w?: number;
  avgVolume?: string;
  dividendYield?: number;
}

export interface PricePoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockChartData {
  code: string;
  period: string;
  data: PricePoint[];
}

export interface ResearchStep {
  id: string;
  label: string;
  status: "pending" | "running" | "done" | "error";
}

export interface ResearchReport {
  stockCode: string;
  stockName: string;
  overview: string;
  coreView: string;
  technicalAnalysis: string;
  fundamentalAnalysis: string;
  riskAnalysis: string;
  valuationAnalysis: string;
  investmentAdvice: string;
  compositeScore: number;
  keyPoints: string[];
  workflowSteps: ResearchStep[];
  generatedAt: string;
}

export interface WatchlistItem {
  code: string;
  name: string;
  price: number;
  changePercent: number;
  addedAt: string;
}
