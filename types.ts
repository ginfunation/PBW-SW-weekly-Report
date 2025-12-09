export interface KPIMetrics {
  target: number;
  achieved: number;
  percentage: number;
  timeProgress: number;
  status: 'On Track' | 'At Risk' | 'Severe Lag';
}

export interface SalesPerson {
  rank: number;
  name: string;
  target: number;
  achieved: number;
  percentage: number;
  risk: string;
}

export interface FunnelStage {
  name: string;
  count: number;
  percentage: number;
  issue: string;
}

export interface ActionItem {
  id: string;
  issue: string;
  risk: string;
  action: string;
}

export interface ReportData {
  reportDate: string;
  reporter: string;
  metrics: KPIMetrics;
  sprintQ4: {
    completed: number;
    pending: number;
    invalid: number;
  };
  individualPerformance: SalesPerson[];
  funnel: FunnelStage[];
  actionItems: ActionItem[];
  nextWeekAgenda: string[];
}
