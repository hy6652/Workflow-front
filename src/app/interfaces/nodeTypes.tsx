import { ImageNode } from "../components/nodes/ImageNode";
import { CustomEdge } from "../components/edges/CustomEdge";
import { initialNodes } from "../components/nodes/initialNodes";

const allTypeKeys = ["imageNode", ...new Set(initialNodes.map((n) => n.type))];

export const nodeTypes = Object.fromEntries(
  allTypeKeys.map((t) => [t, ImageNode]),
) as Record<string, typeof ImageNode>;

export const edgeTypes = {
  customEdge: CustomEdge,
};
