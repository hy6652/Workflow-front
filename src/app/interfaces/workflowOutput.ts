export interface ChartConfig {
  type: string;
  data: {
    labels?: string[];
    datasets: {
      label?: string;
      data: number[];
      [key: string]: unknown;
    }[];
  };
  options?: Record<string, unknown>;
}

export type WorkflowOutput =
  | { kind: "text"; text: string }
  | { kind: "report"; html: string; title: string }
  | { kind: "chart"; chartConfig: ChartConfig };
