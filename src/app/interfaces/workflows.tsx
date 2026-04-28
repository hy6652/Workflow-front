import { Node } from "@xyflow/react";

export interface Workflow {
  id: string;
  name: string;
  description: string;
  version: string;
  orgId: string;
  isActive: boolean;
  isDeleted: boolean;
  nodes: Node[];
  edges: Edge[];
}

interface Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
  edgeType?: "conditional" | "direct" | "fan_out" | "fan_in";
  route?: string;
}
