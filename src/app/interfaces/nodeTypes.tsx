import { ImageNode, CustomEdge } from "../components/CustomNodes";

export const nodeTypes = {
  imageNode: ImageNode,
  manual: ImageNode,
  chat: ImageNode,
  azure_search: ImageNode,
  llm_call: ImageNode,
  aggregator: ImageNode,
  condition: ImageNode,
  while: ImageNode,
  for: ImageNode,
  autonomous_agent: ImageNode,
  output: ImageNode,
  data_transform: ImageNode,
};

export const edgeTypes = {
  customEdge: CustomEdge,
};
