"use client";
import React, { ReactNode } from "react";
import {
  ReactFlow,
  MiniMap,
  Background,
  Edge,
  Node,
  Connection,
  OnNodesChange,
  OnEdgesChange,
} from "@xyflow/react";
import { nodeTypes, edgeTypes } from "../interfaces/nodeTypes";

interface Props {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (params: Connection) => void;
  onNodeDoubleClick: (event: React.MouseEvent, node: Node) => void;
  bottomSlot?: ReactNode;
}

export default function SavedWorkflowViewer({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeDoubleClick,
  bottomSlot,
}: Props) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: "#111" }}>
      <div style={{ flex: 1 }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={nodes.map((n) => ({ ...n, type: "imageNode" }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        fitView
      >
        <MiniMap nodeStrokeWidth={3} />
        <Background />
      </ReactFlow>
      </div>
      {bottomSlot}
    </div>
  );
}
