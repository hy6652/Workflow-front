"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Background,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  MarkerType,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { initialNodes } from "./components/CustomNodes";
import { nodeTypes, edgeTypes } from "./interfaces/nodeTypes";
import { Workflow } from "./interfaces/workflows";
import { DnDProvider } from "./context/DnDContext";
import { runWorkflowJsonAsync } from "@/services/workflowService";
import type { RunWorkflowRequest } from "@/services/workflowService";

// 새로 분리한 컴포넌트들
import WorkflowHeader from "./components/WorkflowHeader";
import WorkflowEditor from "./components/WorkflowEditor";
import SavedWorkflowsPanel from "./components/SavedWorkflowsPanel";
import SavedWorkflowViewer from "./components/SavedWorkflowViewer";
import SideBar from "./components/Sidebar";
import NodeConfigPanel from "./components/NodeConfigPanel";

type Tab = "new" | "saved";

let eid = 0;
const getEdgeId = () => `dndEdge_${eid++}`;

function FlowEditor() {
  const [activeTab, setActiveTab] = useState<Tab>("new");
  const [title, setTitle] = useState("");

  // 에디터용 (새 워크플로우)
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // 뷰어용 (저장된 워크플로우)
  const [savedNodes, setSavedNodes, onSavedNodesChange] = useNodesState<Node>(
    [],
  );
  const [savedEdges, setSavedEdges, onSavedEdgesChange] = useEdgesState<Edge>(
    [],
  );

  const [sideNodes, setSideNodes] = useState<Node[] | null>(null);
  const [configNodeId, setConfigNodeId] = useState<string | null>(null);
  const [savedConfigNodeId, setSavedConfigNodeId] = useState<string | null>(
    null,
  );
  const [savedWorkflows, setSavedWorkflows] = useState<
    { id: string; name: string; fileName: string }[]
  >([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(
    null,
  );

  useEffect(() => {
    setSideNodes(initialNodes);
  }, []);

  useEffect(() => {
    if (activeTab !== "saved") return;
    fetch("/api/workflows")
      .then((res) => res.json())
      .then((data) => setSavedWorkflows(data))
      .catch(console.error);
  }, [activeTab]);

  const onConnect = useCallback(
    (params: Connection) => {
      const arrowEdge: Edge = {
        ...params,
        id: getEdgeId(),
        type: "customEdge",
        markerEnd: { type: MarkerType.ArrowClosed },
      };
      setEdges((eds) => addEdge(arrowEdge, eds));
    },
    [setEdges],
  );

  const onNodeDoubleClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setConfigNodeId(node.id);
    },
    [],
  );

  const handleSaveNodeConfig = useCallback(
    (nodeId: string, parameters: Record<string, any>) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === nodeId ? ({ ...n, parameters } as any) : n)),
      );
      setConfigNodeId(null);
    },
    [setNodes],
  );

  const onSavedNodeDoubleClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSavedConfigNodeId(node.id);
    },
    [],
  );

  const handleSaveSavedNodeConfig = useCallback(
    (nodeId: string, parameters: Record<string, any>) => {
      setSavedNodes((nds) =>
        nds.map((n) => (n.id === nodeId ? ({ ...n, parameters } as any) : n)),
      );
      setSavedConfigNodeId(null);
    },
    [setSavedNodes],
  );

  const onSavedConnect = useCallback(
    (params: Connection) => {
      const arrowEdge: Edge = {
        ...params,
        id: getEdgeId(),
        type: "customEdge",
        markerEnd: { type: MarkerType.ArrowClosed },
      };
      setSavedEdges((eds) => addEdge(arrowEdge, eds));
    },
    [setSavedEdges],
  );

  const handleReset = () => {
    if (confirm("정말로 초기화하시겠습니까?")) {
      setNodes([]);
      setEdges([]);
      setTitle("");
      setConfigNodeId(null);
    }
  };

  const handleSave = async () => {
    if (selectedWorkflow) {
      console.log(`length : ${selectedWorkflow?.edges.length}`);
      setTitle(selectedWorkflow.name);
      setEdges(selectedWorkflow.edges);
      setNodes(selectedWorkflow.nodes);
    }

    if (title === "") {
      alert("워크플로우 제목을 입력해주세요.");
      return;
    }

    if (edges.length <= 0) {
      alert("최소 하나 이상의 연결(Edge)이 필요합니다.");
      return;
    }

    // 엣지 타입 자동 계산 및 변환 로직
    const sourceEdgeCount: Record<string, number> = {};
    const targetEdgeCount: Record<string, number> = {};
    edges.forEach((edge) => {
      const isConditional =
        edge.sourceHandle === "true" || edge.sourceHandle === "false";
      if (!isConditional) {
        sourceEdgeCount[edge.source] = (sourceEdgeCount[edge.source] ?? 0) + 1;
        targetEdgeCount[edge.target] = (targetEdgeCount[edge.target] ?? 0) + 1;
      }
    });

    const transformedEdges = edges.map((edge) => {
      const isConditional =
        edge.sourceHandle === "true" || edge.sourceHandle === "false";
      let edgeType: "conditional" | "direct" | "fan_out" | "fan_in";
      let route: string = "";

      if (isConditional) {
        edgeType = "conditional";
        var eNode: any = nodes.filter((x) => x.id === edge.source)[0];

        if (edge.sourceHandle === "true") route = eNode.parameters.trueOutput;
        else route = eNode.parameters.falseOutput;
      } else {
        const outCount = sourceEdgeCount[edge.source] ?? 0;
        const inCount = targetEdgeCount[edge.target] ?? 0;

        if (outCount > 1) edgeType = "fan_out";
        else if (inCount > 1) edgeType = "fan_in";
        else edgeType = "direct";
      }
      return { ...edge, edgeType, route };
    });

    const workflowData: Workflow = {
      id: `${crypto.randomUUID()}`,
      name: title,
      nodes: nodes,
      edges: transformedEdges,
      description: `${title} 작업`,
      orgId: "org-001",
      isActive: true,
      isDeleted: false,
      version: "1.0.0",
    };

    try {
      const response = await fetch("/api/filesave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workflowData),
      });

      if (response.ok) {
        const triggerNode = nodes.find((n) => (n as any).category === "manual");
        const triggerInput = (triggerNode as any)?.parameters?.input ?? "{}";

        const payload: RunWorkflowRequest = {
          definition: workflowData,
          input: triggerInput,
        };

        const result = await runWorkflowJsonAsync(payload);
        if (result.success) alert("워크플로우 저장 및 실행 성공");
        else alert("워크플로우 저장 성공 (실행은 실패)");
      } else {
        alert("저장 실패!");
      }
    } catch (error) {
      console.error(error);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  const handleSelectSavedWorkflow = async (wf: {
    id: string;
    name: string;
    fileName: string;
  }) => {
    try {
      const response = await fetch(`/api/workflows?fileName=${wf.fileName}`);
      if (!response.ok) throw new Error("파일 읽기 실패");

      const workflowJson = await response.json();
      console.log("Selected workflow content:", workflowJson);

      const workflowData: Workflow = workflowJson;
      console.log("workflowData:", workflowData.name);
      setSelectedWorkflow(workflowData);
      setSavedNodes((workflowData.nodes as any) ?? []);
      setSavedEdges((workflowData.edges as any) ?? []);
      setSavedConfigNodeId(null);
      setTitle(workflowData.name);
    } catch (error) {
      console.error(error);
      alert("워크플로우 데이터를 가져오는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#1a1a1a",
        color: "#fff",
      }}
    >
      {/* 1. Header 영역 */}
      <WorkflowHeader
        activeTab={activeTab}
        selectedWorkflow={selectedWorkflow}
        setActiveTab={setActiveTab}
        title={title}
        setTitle={setTitle}
        onReset={handleReset}
        onSave={handleSave}
      />

      {/* 2. Body 영역 */}
      <main style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {activeTab === "new" ? (
          <WorkflowEditor
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDoubleClick={onNodeDoubleClick}
            configNodeId={configNodeId}
            setConfigNodeId={setConfigNodeId}
            handleSaveNodeConfig={handleSaveNodeConfig}
            sideNodes={sideNodes}
          />
        ) : selectedWorkflow ? (
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            <SavedWorkflowViewer
              nodes={savedNodes}
              edges={savedEdges}
              onNodesChange={onSavedNodesChange}
              onEdgesChange={onSavedEdgesChange}
              onConnect={onSavedConnect}
              onNodeDoubleClick={onSavedNodeDoubleClick}
            />
            {savedConfigNodeId ? (
              <NodeConfigPanel
                key={savedConfigNodeId}
                nodeId={savedConfigNodeId}
                category={
                  (savedNodes.find((n) => n.id === savedConfigNodeId) as any)
                    ?.category ?? ""
                }
                initialParameters={
                  (savedNodes.find((n) => n.id === savedConfigNodeId) as any)
                    ?.parameters
                }
                onSave={handleSaveSavedNodeConfig}
                onClose={() => setSavedConfigNodeId(null)}
              />
            ) : (
              <SideBar
                nodes={sideNodes}
                onBack={() => {
                  setSelectedWorkflow(null);
                  setTitle("");
                }}
              />
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            <div
              style={{
                flex: 1,
                backgroundColor: "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#444",
                fontSize: "13px",
              }}
            >
              저장된 워크플로우를 보려면 목록에서 선택하세요.
            </div>
            <SavedWorkflowsPanel
              workflows={savedWorkflows}
              onSelect={handleSelectSavedWorkflow}
              selectedWorkflow={selectedWorkflow}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default function EditWorkflow() {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <FlowEditor />
      </DnDProvider>
    </ReactFlowProvider>
  );
}
