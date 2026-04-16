export type WorkflowOutput =
  | { kind: "text"; text: string }
  | { kind: "report"; html: string; title: string };
