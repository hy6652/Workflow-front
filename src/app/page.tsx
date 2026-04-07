"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  useReactFlow,
  MiniMap,
  Background,
  Connection,
  Edge,
  MarkerType,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { initialNodes } from "./components/CustomNodes";
import { nodeTypes, edgeTypes } from "./interfaces/nodeTypes";
import SideBar from "./components/Sidebar";
import NodeConfigPanel from "./components/NodeConfigPanel";
import { ChangeNodes, Workflow } from "./interfaces/workflows";
import { DnDProvider, useDnD } from "./context/DnDContext";
import { randomUUID } from "crypto";
import { runWorkflowJsonAsync } from "@/services/workflowService";
import type { RunWorkflowRequest } from "@/services/workflowService";

// const nodeList = [
//   { label: "트리거", imageUrl: "nodeImages/touch_app.svg", category: "manual" },
//   {
//     label: "Azure Search",
//     imageUrl: "nodeImages/document_search.svg",
//     category: "azure_search",
//   },
//   {
//     label: "Agent 답변 생성",
//     imageUrl: "nodeImages/chat.svg",
//     category: "llm_call",
//   },
//   {
//     label: "노션 작성",
//     imageUrl: "nodeImages/edit.svg",
//     category: "autonomous_agent",
//   },
// ];

type Tab = "new" | "saved";

// export default function EditWorkflow() {
//   const [activeTab, setActiveTab] = useState<Tab>("new");
//   const [title, setTitle] = useState("");
//   const [nodes, setNodes] = useState(initialNodes);
//   const [edges, setEdges] = useState(initialEdges);
//   const [workflow, setWorkflow] = useState<Workflow | null>(null);
//   const [sideNodes, setSideNodes] = useState<Node[] | null>(null);
//   const [menu, setMenu] = useState(null);

//   // dnd
//   const reactFlowWrapper = useRef(null);
//   useEffect(() => {
//     setSideNodes(nodes);
//   }, []);

//   const onNodesChange = useCallback(
//     (changes: any) =>
//       setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
//     [],
//   );

//   const onEdgesChange = useCallback(
//     (changes: any) =>
//       setEdges((edgeSnapshot) => applyEdgeChanges(changes, edgeSnapshot)),
//     [],
//   );

//   const onConnect = useCallback(
//     (params: any) => setEdges((edgeSnapshot) => addEdge(params, edgeSnapshot)),
//     [],
//   );

//   // const onNodeContextMenu = useCallback(
//   //   (event: any, node: any) => {
//   //     // Prevent native context menu from showing
//   //     event.preventDefault();

//   //     // Calculate position of the context menu. We want to make sure it
//   //     // doesn't get positioned off-screen.
//   //     const pane = ref.current.getBoundingClientRect();
//   //     setMenu({
//   //       id: node.id,
//   //       top: event.clientY < pane.height - 200 && event.clientY,
//   //       left: event.clientX < pane.width - 200 && event.clientX,
//   //       right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
//   //       bottom:
//   //         event.clientY >= pane.height - 200 && pane.height - event.clientY,
//   //     });
//   //   },
//   //   [setMenu],
//   // );

//   // workflow 저장
//   const handleSave = async () => {
//     if (title == "") {
//       alert.apply("need title");
//       return;
//     }

//     if (edges.length <= 0) {
//       alert.apply("edges need");
//       return;
//     }

//     // setWorkflow({
//     //   id: "",
//     //   name: title,
//     //   nodes: nodes,

//     // })

//     if (workflow != null) {
//       const stringfiedJson = JSON.stringify(workflow);

//       const response = await fetch("/api/save-workflow", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(stringfiedJson),
//       });

//       if (response.ok) {
//         alert("VS Code 프로젝트 내 NewWorkflows 폴더에 저장되었습니다!");
//       } else {
//         alert("저장 실패!");
//       }
//     }
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         width: "100vw",
//         height: "100vh",
//         backgroundColor: "#1a1a1a",
//         color: "#fff",
//       }}
//     >
//       {/* Header */}
//       <header
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           padding: "0 24px",
//           borderBottom: "1px solid #333",
//           flexShrink: 0,
//         }}
//       >
//         {/* 왼쪽: 탭 */}
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <button
//             onClick={() => setActiveTab("new")}
//             style={{
//               padding: "14px 20px",
//               background: "none",
//               border: "none",
//               color: activeTab === "new" ? "#fff" : "#666",
//               borderBottom:
//                 activeTab === "new"
//                   ? "2px solid #fff"
//                   : "2px solid transparent",
//               cursor: "pointer",
//               fontSize: "14px",
//               fontWeight: activeTab === "new" ? "bold" : "normal",
//             }}
//           >
//             새 워크플로우
//           </button>
//           <button
//             onClick={() => setActiveTab("saved")}
//             style={{
//               padding: "14px 20px",
//               background: "none",
//               border: "none",
//               color: activeTab === "saved" ? "#fff" : "#666",
//               borderBottom:
//                 activeTab === "saved"
//                   ? "2px solid #fff"
//                   : "2px solid transparent",
//               cursor: "pointer",
//               fontSize: "14px",
//               fontWeight: activeTab === "saved" ? "bold" : "normal",
//             }}
//           >
//             저장된 워크플로우
//           </button>
//         </div>

//         {/* 오른쪽: 제목 + 버튼 */}
//         <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="워크플로우 제목"
//             style={{
//               background: "none",
//               border: "none",
//               borderBottom: "1px solid #444",
//               color: "#fff",
//               fontSize: "14px",
//               padding: "4px",
//               width: "180px",
//               outline: "none",
//             }}
//           />
//           <button
//             style={{
//               padding: "6px 14px",
//               backgroundColor: "#333",
//               border: "1px solid #555",
//               borderRadius: "6px",
//               color: "#fff",
//               cursor: "pointer",
//               fontSize: "13px",
//             }}
//           >
//             리셋
//           </button>
//           <button
//             style={{
//               padding: "6px 14px",
//               backgroundColor: "#fff",
//               border: "none",
//               borderRadius: "6px",
//               color: "#000",
//               cursor: "pointer",
//               fontSize: "13px",
//               fontWeight: "bold",
//             }}
//           >
//             저장
//           </button>
//         </div>
//       </header>

//       {/* Body */}
//       <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
//         {/* ReactFlow canvas */}
//         <div style={{ flex: 1 }}>
//           <ReactFlow
//             nodeTypes={nodeTypes}
//             nodes={nodes}
//             edges={edges}
//             onNodesChange={onNodesChange}
//             onEdgesChange={onEdgesChange}
//             onConnect={onConnect}
//             fitView
//           >
//             <MiniMap nodeStrokeWidth={3} />
//             <Background />
//           </ReactFlow>
//         </div>

//         {/* Node list panel */}
//         <SideBar nodes={sideNodes} />
//       </div>
//     </div>
//   );
// }

let id = 0;
const getId = () => `dndnode_${id++}`;

let eid = 0;
const getEdgeId = () => `dndEdge_${eid++}`;

function FlowEditor() {
  const [activeTab, setActiveTab] = useState<Tab>("new");
  const [title, setTitle] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [sideNodes, setSideNodes] = useState<Node[] | null>(null);
  const [configNodeId, setConfigNodeId] = useState<string | null>(null);
  const [savedWorkflows, setSavedWorkflows] = useState<
    { id: string; name: string; fileName: string }[]
  >([]);
  const reactFlowWrapper = useRef(null);

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

  const onConnect = useCallback((params: Connection) => {
    const arrowEdge: Edge = {
      ...params,
      id: getEdgeId(),
      type: "customEdge",
      markerEnd: { type: MarkerType.ArrowClosed },
    };
    setEdges((eds) => addEdge(arrowEdge, eds));

    console.log(`edges : ${edges.map((x) => x)}`);
  }, []);

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

  // reset
  const handleReset = () => {
    setNodes([]);
    setEdges([]);
    setTitle("");
    return;
  };

  // workflow 저장
  const handleSave = async () => {
    if (title == "") {
      alert("need title");
      console.log(`need title`);
      return;
    }

    if (edges.length <= 0) {
      alert("edges need");
      console.log(`need edges`);
      return;
    }

    // 소스/타겟별 엣지 개수 집계 (conditional 제외)
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

    // 엣지에 edgeType 주입
    const transformedEdges = edges.map((edge) => {
      const isConditional =
        edge.sourceHandle === "true" || edge.sourceHandle === "false";
      let edgeType: "conditional" | "direct" | "fan_out" | "fan_in";
      if (isConditional) {
        edgeType = "conditional";
      } else {
        const outCount = sourceEdgeCount[edge.source] ?? 0;
        const inCount = targetEdgeCount[edge.target] ?? 0;
        if (outCount > 1) edgeType = "fan_out";
        else if (inCount > 1) edgeType = "fan_in";
        else edgeType = "direct";
      }
      return { ...edge, edgeType };
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

      console.log(`workflow : ${workflowData}`);
      await runWorkflowJsonAsync(payload).then((response) => {
        console.log(`response status : ${response.success}`);
        if (response.success) alert("워크플로우 실행 성공");
        else alert("워크플로우 실행 실패");
      });
    } else {
      alert("저장 실패!");
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
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          borderBottom: "1px solid #333",
          flexShrink: 0,
        }}
      >
        {/* 왼쪽: 탭 */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={() => setActiveTab("new")}
            style={{
              padding: "14px 20px",
              background: "none",
              border: "none",
              color: activeTab === "new" ? "#fff" : "#666",
              borderBottom:
                activeTab === "new"
                  ? "2px solid #fff"
                  : "2px solid transparent",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: activeTab === "new" ? "bold" : "normal",
            }}
          >
            새 워크플로우
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            style={{
              padding: "14px 20px",
              background: "none",
              border: "none",
              color: activeTab === "saved" ? "#fff" : "#666",
              borderBottom:
                activeTab === "saved"
                  ? "2px solid #fff"
                  : "2px solid transparent",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: activeTab === "saved" ? "bold" : "normal",
            }}
          >
            저장된 워크플로우
          </button>
        </div>

        {/* 오른쪽: 제목 + 버튼 */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="워크플로우 제목"
            style={{
              background: "none",
              border: "none",
              borderBottom: "1px solid #444",
              color: "#fff",
              fontSize: "14px",
              padding: "4px",
              width: "180px",
              outline: "none",
            }}
          />
          <button
            onClick={handleReset}
            style={{
              padding: "6px 14px",
              backgroundColor: "#333",
              border: "1px solid #555",
              borderRadius: "6px",
              color: "#fff",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            리셋
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "6px 14px",
              backgroundColor: "#fff",
              border: "none",
              borderRadius: "6px",
              color: "#000",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            저장
          </button>
        </div>
      </header>

      {/* Body */}
      {activeTab === "new" ? (
        <div
          style={{ display: "flex", flex: 1, overflow: "hidden" }}
          className="reactflow-wrapper"
          ref={reactFlowWrapper}
        >
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
          {configNodeId ? (
            <NodeConfigPanel
              key={configNodeId}
              nodeId={configNodeId}
              category={
                (nodes.find((n) => n.id === configNodeId) as any)?.category ??
                ""
              }
              initialParameters={
                (nodes.find((n) => n.id === configNodeId) as any)?.parameters
              }
              onSave={handleSaveNodeConfig}
              onClose={() => setConfigNodeId(null)}
            />
          ) : (
            <SideBar nodes={sideNodes} />
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* 왼쪽: 빈 캔버스 영역 */}
          <div style={{ flex: 1, backgroundColor: "#111" }} />

          {/* 오른쪽: 저장된 워크플로우 목록 */}
          <div
            style={{
              width: "220px",
              borderLeft: "1px solid #333",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              overflowY: "auto",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#888",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              저장된 워크플로우
            </div>
            {savedWorkflows.length === 0 ? (
              <div style={{ fontSize: "12px", color: "#555" }}>없음</div>
            ) : (
              savedWorkflows.map((wf) => (
                <div
                  key={wf.id}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #333",
                    backgroundColor: "#222",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    {wf.name}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#666",
                      marginTop: "2px",
                    }}
                  >
                    {wf.fileName}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
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
