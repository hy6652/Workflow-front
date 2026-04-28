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

import { initialNodes } from "./components/nodes/initialNodes";
import { Workflow } from "./interfaces/workflows";
import { DnDProvider } from "./context/DnDContext";
import {
  createWorkflow,
  runWorkflowJsonAsync,
} from "@/services/workflowService";
import type { CreateRequest } from "@/services/workflowService";
import {
  resolveNodeType,
  buildTransformedEdges,
  extractResult,
  saveReportFile,
  makeArrowEdge,
} from "./utils/workflowUtils";

import WorkflowHeader from "./components/WorkflowHeader";
import WorkflowEditor from "./components/WorkflowEditor";
import SavedWorkflowsPanel from "./components/SavedWorkflowsPanel";
import SavedWorkflowViewer from "./components/SavedWorkflowViewer";
import SideBar from "./components/Sidebar";
import NodeConfigPanel from "./components/NodeConfigPanel";
import ChatPanel from "./components/ChatPanel";

type Tab = "new" | "saved";

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
    (params: Connection) =>
      setEdges((eds) => addEdge(makeArrowEdge(params), eds)),
    [setEdges],
  );

  const onSavedConnect = useCallback(
    (params: Connection) =>
      setSavedEdges((eds) => addEdge(makeArrowEdge(params), eds)),
    [setSavedEdges],
  );

  const onNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: Node) => setConfigNodeId(node.id),
    [],
  );

  const onSavedNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: Node) => setSavedConfigNodeId(node.id),
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

  const handleSaveSavedNodeConfig = useCallback(
    (nodeId: string, parameters: Record<string, any>) => {
      setSavedNodes((nds) =>
        nds.map((n) => (n.id === nodeId ? ({ ...n, parameters } as any) : n)),
      );
      setSavedConfigNodeId(null);
    },
    [setSavedNodes],
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
        return;
      }
      alert("저장 완료");
    } catch (error) {
      console.error(error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const handleTestNew = useCallback(
    async (input: string) => {
      if (nodes.length === 0)
        return { kind: "text" as const, text: "워크플로우가 비어 있습니다." };
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
      const output = extractResult(result);
      if (output.kind === "report")
        await saveReportFile(output.html, output.title);
      return output;
    },
    [nodes, edges, title],
  );

  const handleTestSaved = useCallback(
    async (input: string) => {
      if (!selectedWorkflow)
        return { kind: "text" as const, text: "워크플로우를 선택해주세요." };
      const result = await runWorkflowJsonAsync({
        definition: selectedWorkflow,
        input,
      });
      const output = extractResult(result);
      if (output.kind === "report")
        await saveReportFile(output.html, output.title);
      return output;
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

      const workflowData: Workflow = await response.json();

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
          let handle: string | undefined;

          if (raw.edgeType === "conditional") {
            const route = raw.route;
            if (
              route === "true" ||
              route === "false" ||
              route === "loop" ||
              route === "done"
            ) {
              handle = route;
            }
          }

          const { targetHandle: _th, sourceHandle: _sh, ...restE } = raw;
          return {
            ...restE,
            type: "customEdge",
            markerEnd: { type: MarkerType.ArrowClosed },
            ...(handle !== undefined && { sourceHandle: handle }),
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
