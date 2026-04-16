"use client";

import React, { useRef, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Background,
  Connection,
  Edge,
  Node,
  OnNodesChange,
  OnEdgesChange,
} from "@xyflow/react";
import { nodeTypes, edgeTypes } from "../interfaces/nodeTypes";
import { WorkflowOutput } from "../interfaces/workflowOutput";
import SideBar from "./Sidebar";
import NodeConfigPanel from "./NodeConfigPanel";
import ChatPanel from "./ChatPanel";

/** 노드의 비즈니스 타입을 반환합니다.
 * 새 노드: type = "manual" 등 (비즈니스 타입)
 * 구 JSON 노드: type = "imageNode", category에 비즈니스 타입 존재 */
function resolveNodeType(node: any): string {
  if (!node) return "";
  return node.type === "imageNode" ? (node.category ?? "") : (node.type ?? "");
}

interface WorkflowEditorProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (params: Connection) => void;
  onNodeDoubleClick: (event: React.MouseEvent, node: Node) => void;
  configNodeId: string | null;
  setConfigNodeId: (id: string | null) => void;
  handleSaveNodeConfig: (
    nodeId: string,
    parameters: Record<string, any>,
  ) => void;
  sideNodes: Node[] | null;
  handleCreate: (input: string) => void;
  onTest?: (input: string) => Promise<WorkflowOutput>;
}

export default function WorkflowEditor({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeDoubleClick,
  configNodeId,
  setConfigNodeId,
  handleSaveNodeConfig,
  sideNodes,
  handleCreate,
  onTest,
}: WorkflowEditorProps) {
  const reactFlowWrapper = useRef(null);
  const [showChat, setShowChat] = useState(false);

  const panelMode = (nodes as any[]).some(
    (n) => resolveNodeType(n) === "chat",
  )
    ? "chat"
    : "manual";

  return (
    <div
      style={{ display: "flex", flex: 1, overflow: "hidden" }}
      className="reactflow-wrapper"
      ref={reactFlowWrapper}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ flex: 1 }}>
          <ReactFlow
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDoubleClick={onNodeDoubleClick}
          >
            <MiniMap nodeStrokeWidth={3} />
            <Background />
          </ReactFlow>
        </div>
      </div>

      {showChat && onTest && (
        <ChatPanel
          onSend={onTest}
          onClose={() => setShowChat(false)}
          mode={panelMode}
        />
      )}

      {configNodeId ? (
        <NodeConfigPanel
          key={configNodeId}
          nodeId={configNodeId}
          type={resolveNodeType(nodes.find((n) => n.id === configNodeId))}
          initialParameters={
            (nodes.find((n) => n.id === configNodeId) as any)?.parameters
          }
          onSave={handleSaveNodeConfig}
          onClose={() => setConfigNodeId(null)}
        />
      ) : (
        <SideBar
          nodes={sideNodes}
          handleCreate={handleCreate}
          onTest={onTest}
          showChat={showChat}
          onToggleChat={() => setShowChat((v) => !v)}
        />
      )}
    </div>
  );
}
