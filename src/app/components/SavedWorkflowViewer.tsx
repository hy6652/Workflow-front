"use client";
import React from "react";
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
}

export default function SavedWorkflowViewer({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeDoubleClick,
}: Props) {
  return (
    <div style={{ flex: 1, backgroundColor: "#111" }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={nodes}
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
  );
}
