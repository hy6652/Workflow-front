import { Edge, Node, MarkerType, Connection } from "@xyflow/react";
import { WorkflowOutput } from "../interfaces/workflowOutput";
import { buildReportHtml } from "./reportHtml";
import type { APIResponse } from "@/services/workflowService";

let edgeCount = 1;
export const getEdgeId = () => `edge_${edgeCount++}`;

export function resolveNodeType(node: any): string {
  if (!node) return "";
  return node.type === "imageNode" ? (node.category ?? "") : (node.type ?? "");
}

export function makeArrowEdge(params: Connection): Edge {
  return {
    ...params,
    id: getEdgeId(),
    type: "customEdge",
    markerEnd: { type: MarkerType.ArrowClosed },
  } as Edge;
}

export function buildTransformedEdges(edges: Edge[], nodes: Node[]) {
  const isConditionalHandle = (handle: string | null | undefined) =>
    handle === "true" ||
    handle === "false" ||
    handle === "done" ||
    handle === "loop";

  // while 노드는 초기 입력 + loop 귀환으로 항상 두 개의 incoming edge가 생기므로
  // fan_in 카운트에서 제외하고 항상 direct로 처리
  const whileNodeIds = new Set(
    nodes.filter((n) => resolveNodeType(n) === "while").map((n) => n.id),
  );

  const sourceEdgeCount: Record<string, number> = {};
  const targetEdgeCount: Record<string, number> = {};
  edges.forEach((edge) => {
    if (
      !isConditionalHandle(edge.sourceHandle) &&
      !whileNodeIds.has(edge.target)
    ) {
      sourceEdgeCount[edge.source] = (sourceEdgeCount[edge.source] ?? 0) + 1;
      targetEdgeCount[edge.target] = (targetEdgeCount[edge.target] ?? 0) + 1;
    }
  });

  return edges.map((edge) => {
    let edgeType: "conditional" | "direct" | "fan_out" | "fan_in";
    let route = "";
    if (isConditionalHandle(edge.sourceHandle)) {
      edgeType = "conditional";
      if (edge.sourceHandle === "true" || edge.sourceHandle === "false") {
        const eNode: any = nodes.find((x) => x.id === edge.source);
        route =
          edge.sourceHandle === "true"
            ? (eNode?.parameters?.trueOutput ?? "")
            : (eNode?.parameters?.falseOutput ?? "");
      } else {
        route = edge.sourceHandle!;
      }
    } else if (whileNodeIds.has(edge.target)) {
      edgeType = "direct";
    } else {
      const outCount = sourceEdgeCount[edge.source] ?? 0;
      const inCount = targetEdgeCount[edge.target] ?? 0;
      if (outCount > 1) edgeType = "fan_out";
      else if (inCount > 1) edgeType = "fan_in";
      else edgeType = "direct";
    }
    return { ...edge, edgeType, route };
  });
}

export function extractResult(result: APIResponse): WorkflowOutput {
  if (!result.success) {
    return { kind: "text", text: result.error ?? "알 수 없는 오류" };
  }
  const data = result.outputs?.[0]?.Data ?? result.outputs?.[0]?.data;
  if (data?.type === "report") {
    return {
      kind: "report",
      html: buildReportHtml(data),
      title: data.reportTitle ?? "보고서",
    };
  }
  const text =
    data?.text ??
    (result.outputs?.[0] != null
      ? JSON.stringify(result.outputs[0], null, 2)
      : "결과 없음");
  return { kind: "text", text };
}

export async function saveReportFile(html: string, title: string): Promise<void> {
  const safe = title.replace(/[\\/:*?"<>|]/g, "_");
  const filename = `${safe}_${new Date().toISOString().slice(0, 10)}.html`;
  await fetch("/api/save-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html, filename }),
  }).catch((e) => console.error("보고서 저장 실패:", e));
}
