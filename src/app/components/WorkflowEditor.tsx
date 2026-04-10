"use client";

import React, { useRef, ReactNode } from "react";
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
import SideBar from "./Sidebar";
import NodeConfigPanel from "./NodeConfigPanel";

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
  bottomSlot?: ReactNode;
  handleCreate: (input: string) => void;
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
  bottomSlot,
  handleCreate,
}: WorkflowEditorProps) {
  const reactFlowWrapper = useRef(null);

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
        {bottomSlot}
      </div>

      {configNodeId ? (
        <NodeConfigPanel
          key={configNodeId}
          nodeId={configNodeId}
          category={
            (nodes.find((n) => n.id === configNodeId) as any)?.category ?? ""
          }
          initialParameters={
            (nodes.find((n) => n.id === configNodeId) as any)?.parameters
          }
          onSave={handleSaveNodeConfig}
          onClose={() => setConfigNodeId(null)}
        />
      ) : (
        <SideBar nodes={sideNodes} handleCreate={handleCreate} />
      )}
    </div>
  );
}
