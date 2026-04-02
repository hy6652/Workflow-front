export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
}

export interface Node {
  id: string;
  type: string;
  category?: string;
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
  route?: string;
}

export const ChangeNodes = (data: any[]): Node[] => {
  return data.map((item) => ({
    id: item.id,
    type: item.type,
    category: item.category,
    position: item.position,
    data: item.data,
  }));
};

export interface NodeProps {
  nodes: Node[] | null;
}
