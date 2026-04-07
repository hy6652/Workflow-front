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

export interface Node2 {
  id: string;
  type: string;
  category: string;
  position: NodePosition;
  data: NodeData;
}

interface NodePosition {
  x: number;
  y: number;
}

interface NodeData {
  label: string;
  imageUrl: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
  edgeType?: "conditional" | "direct" | "fan_out" | "fan_in";
  route?: string;
}

export const ChangeNodes = (data: any[]): Node2[] => {
  return data.map((item) => ({
    id: item.id,
    type: item.type,
    category: item.category,
    position: item.position,
    data: item.data,
  }));
};
