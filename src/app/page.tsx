"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
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
import { Workflow } from "./interfaces/workflows";
import { DnDProvider } from "./context/DnDContext";
import {
  createWorkflow,
  runWorkflowJsonAsync,
} from "@/services/workflowService";
import type { APIResponse, CreateRequest } from "@/services/workflowService";

import WorkflowHeader from "./components/WorkflowHeader";
import WorkflowEditor from "./components/WorkflowEditor";
import SavedWorkflowsPanel from "./components/SavedWorkflowsPanel";
import SavedWorkflowViewer from "./components/SavedWorkflowViewer";
import SideBar from "./components/Sidebar";
import NodeConfigPanel from "./components/NodeConfigPanel";
import ChatPanel from "./components/ChatPanel";

type Tab = "new" | "saved";

let eid = 0;
const getEdgeId = () => `dndEdge_${eid++}`;

function resolveNodeType(node: any): string {
  if (!node) return "";
  return node.type === "imageNode" ? (node.category ?? "") : (node.type ?? "");
}

function buildTransformedEdges(edges: Edge[], nodes: Node[]) {
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
  return edges.map((edge) => {
    const isConditional =
      edge.sourceHandle === "true" || edge.sourceHandle === "false";
    let edgeType: "conditional" | "direct" | "fan_out" | "fan_in";
    let route = "";
    if (isConditional) {
      edgeType = "conditional";
      const eNode: any = nodes.find((x) => x.id === edge.source);
      route =
        edge.sourceHandle === "true"
          ? (eNode?.parameters?.trueOutput ?? "")
          : (eNode?.parameters?.falseOutput ?? "");
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

function extractResultText(result: APIResponse): string {
  if (!result.success) return result.error ?? "알 수 없는 오류";
  return (
    result.outputs?.[0]?.Data?.text ??
    result.outputs?.[0]?.data?.text ??
    (result.outputs?.[0] != null
      ? JSON.stringify(result.outputs[0], null, 2)
      : "결과 없음")
  );
}

function FlowEditor() {
  const [activeTab, setActiveTab] = useState<Tab>("new");
  const [title, setTitle] = useState("");

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

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
  const [showSavedChat, setShowSavedChat] = useState(false);
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

  const handleTabChange = (tab: Tab) => {
    if (tab === "saved" && activeTab === "new") {
      if (nodes.length > 0 || edges.length > 0) {
        if (!confirm("저장되지 않은 작업이 있습니다. 이동하시겠습니까?"))
          return;
      }
      setNodes([]);
      setEdges([]);
      setTitle("");
      setConfigNodeId(null);
      setSelectedWorkflow(null);
    }
    if (tab === "new" && activeTab === "saved") {
      setSelectedWorkflow(null);
      setSavedNodes([]);
      setSavedEdges([]);
      setSavedConfigNodeId(null);
    }
    setActiveTab(tab);
  };

  const handleReset = () => {
    if (confirm("정말로 초기화하시겠습니까?")) {
      setNodes([]);
      setEdges([]);
      setTitle("");
      setConfigNodeId(null);
    }
  };

  const handleSave = async () => {
    if (title === "") {
      alert("워크플로우 제목을 입력해주세요.");
      return;
    }
    if (edges.length <= 0) {
      alert("최소 하나 이상의 연결(Edge)이 필요합니다.");
      return;
    }

    const workflowData: Workflow = {
      id: `${crypto.randomUUID()}`,
      name: title,
      nodes: nodes,
      edges: buildTransformedEdges(edges, nodes) as any,
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
      if (!response.ok) {
        alert("저장 실패!");
      }
    } catch (error) {
      console.error(error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const handleTestNew = useCallback(
    async (input: string): Promise<string> => {
      if (nodes.length === 0) return "워크플로우가 비어 있습니다.";
      const workflowData: Workflow = {
        id: crypto.randomUUID(),
        name: title || "test",
        nodes,
        edges: buildTransformedEdges(edges, nodes) as any,
        description: title || "test",
        orgId: "org-001",
        isActive: true,
        isDeleted: false,
        version: "1.0.0",
      };
      const result = await runWorkflowJsonAsync({
        definition: workflowData,
        input,
      });
      return extractResultText(result);
    },
    [nodes, edges, title],
  );

  const handleTestSaved = useCallback(
    async (input: string): Promise<string> => {
      if (!selectedWorkflow) return "워크플로우를 선택해주세요.";
      const result = await runWorkflowJsonAsync({
        definition: selectedWorkflow,
        input,
      });
      return extractResultText(result);
    },
    [selectedWorkflow],
  );

  const handleSelectSavedWorkflow = async (wf: {
    id: string;
    name: string;
    fileName: string;
  }) => {
    try {
      const response = await fetch(`/api/workflows?fileName=${wf.fileName}`);
      if (!response.ok) throw new Error("파일 읽기 실패");

      const workflowJson = await response.json();
      const workflowData: Workflow = workflowJson;

      setSelectedWorkflow(workflowData);
      setSavedNodes((workflowData.nodes as any) ?? []);
      setSavedEdges(
        ((workflowData.edges as any[]) ?? []).map((e) => {
          const cleaned: any = { ...e };
          if (cleaned.targetHandle == null) delete cleaned.targetHandle;
          if (cleaned.sourceHandle == null) delete cleaned.sourceHandle;
          if (!cleaned.markerEnd)
            cleaned.markerEnd = { type: MarkerType.ArrowClosed };
          return cleaned;
        }),
      );
      setSavedConfigNodeId(null);
      setTitle(workflowData.name);
    } catch (error) {
      console.error(error);
      alert("워크플로우 데이터를 가져오는 중 오류가 발생했습니다.");
    }
  };

  const handleCreateWorkflow = async (input: string) => {
    if (!input) throw new Error("입력이 없습니다.");

    const body: CreateRequest = { input };
    const response = await createWorkflow(body);
    if (response.success) {
      const wf: Workflow = JSON.parse(response.workflowJson);

      const nds = wf.nodes;
      if (nds) {
        const updatednds = nds.map((n) => {
          const type = (n as any).type;
          const nData = initialNodes.filter((x) => x.type === type)[0]?.data;
          return { ...n, data: nData };
        });
        setNodes(updatednds);
      }

      if (wf.edges) {
        const updatedEds = wf.edges.map((e) => {
          const raw = e as any;
          let sourceHandle: string | undefined;

          if (raw.edgeType === "conditional") {
            const sh = raw.sourceHandle;
            if (sh === true || sh === "true") sourceHandle = "true";
            else if (sh === false || sh === "false") sourceHandle = "false";
            else if (raw.label === "true") sourceHandle = "true";
            else if (raw.label === "false") sourceHandle = "false";
          }

          const { targetHandle: _th, sourceHandle: _sh, ...restE } = raw;
          return {
            ...restE,
            type: "customEdge",
            markerEnd: { type: MarkerType.ArrowClosed },
            ...(sourceHandle !== undefined && { sourceHandle }),
          };
        });
        setEdges(updatedEds as any);
      }
    } else {
      alert("워크플로우 생성 실패");
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
      <WorkflowHeader
        activeTab={activeTab}
        selectedWorkflow={selectedWorkflow}
        setActiveTab={handleTabChange}
        title={title}
        setTitle={setTitle}
        onReset={handleReset}
        onSave={handleSave}
      />

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
            handleCreate={handleCreateWorkflow}
            onTest={handleTestNew}
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
            {showSavedChat && (
              <ChatPanel
                onSend={handleTestSaved}
                onClose={() => setShowSavedChat(false)}
                mode={
                  (savedNodes as any[]).some(
                    (n) => resolveNodeType(n) === "chat",
                  )
                    ? "chat"
                    : "manual"
                }
              />
            )}
            {savedConfigNodeId ? (
              <NodeConfigPanel
                key={savedConfigNodeId}
                nodeId={savedConfigNodeId}
                type={resolveNodeType(
                  savedNodes.find((n) => n.id === savedConfigNodeId),
                )}
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
                  setShowSavedChat(false);
                }}
                handleCreate={handleCreateWorkflow}
                onTest={handleTestSaved}
                showChat={showSavedChat}
                onToggleChat={() => setShowSavedChat((v) => !v)}
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
