"use client";

import {
  Position,
  Handle,
  useReactFlow,
  useNodes,
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
} from "@xyflow/react";
import { useState } from "react";

// custom node 설정
export const ImageNode = (props: any) => {
  const { setNodes, setEdges } = useReactFlow();
  const nodes = useNodes();
  const [hovered, setHovered] = useState(false);

  const currentNode = nodes.find((n) => n.id === props.id);
  const rawType = (currentNode as any)?.type as string | undefined;
  const category = (currentNode as any)?.category as string | undefined;
  // 구 JSON 노드: type="imageNode", category=비즈니스타입 → category로 fallback
  const type = rawType === "imageNode" ? (category ?? "") : (rawType ?? "");

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((nds) => nds.filter((node) => node.id !== props.id));
    setEdges((eds) =>
      eds.filter(
        (edge) => edge.source !== props.id && edge.target !== props.id,
      ),
    );
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        position: "relative",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          height: "13px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {hovered && (
          <button
            onClick={onDelete}
            style={{
              backgroundColor: "#757575",
              width: "15px",
              height: "15px",
              borderRadius: "30%",
              border: "none",
              padding: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        )}
      </div>
      <div style={{ position: "relative" }}>
        <div
          style={{
            borderRadius: "20%",
            backgroundColor: "#000",
            border: "2px solid #fff",
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={props.data?.imageUrl ?? ""}
            alt={props.data?.label ?? ""}
            style={{
              width: "24px",
              height: "24px",
              objectFit: "cover",
            }}
          />
        </div>
        {!props.data?.label?.includes("트리거") && (
          <Handle type="target" position={Position.Left} />
        )}

        {type === "condition" ? (
          <>
            <Handle
              type="source"
              position={Position.Right}
              id="true"
              style={{ top: "25%" }}
            />
            <Handle
              type="source"
              position={Position.Right}
              id="false"
              style={{ top: "75%" }}
            />
            <span
              style={{
                backgroundColor: "#808080",
                padding: "0px 2px",
                borderRadius: "20%",
                position: "absolute",
                right: "-25px",
                top: "12%",
                fontSize: "8px",
                color: "#BEBEBE",
                zIndex: 10,
                pointerEvents: "none",
              }}
            >
              true
            </span>
            <span
              style={{
                backgroundColor: "#808080",
                padding: "0px 2px",
                borderRadius: "20%",
                position: "absolute",
                right: "-28px",
                top: "63%",
                fontSize: "8px",
                color: "#BEBEBE",
                zIndex: 10,
                pointerEvents: "none",
              }}
            >
              false
            </span>
          </>
        ) : type === "while" || type === "foreach" ? (
          <>
            <Handle
              type="source"
              position={Position.Right}
              id="done"
              style={{ top: "25%" }}
            />
            <Handle
              type="source"
              position={Position.Right}
              id="loop"
              style={{ top: "75%" }}
            />
            <span
              style={{
                backgroundColor: "#808080",
                padding: "0px 2px",
                borderRadius: "20%",
                position: "absolute",
                right: "-28px",
                top: "12%",
                fontSize: "8px",
                color: "#BEBEBE",
                zIndex: 10,
                pointerEvents: "none",
              }}
            >
              done
            </span>
            <span
              style={{
                backgroundColor: "#808080",
                padding: "0px 2px",
                borderRadius: "20%",
                position: "absolute",
                right: "-26px",
                top: "63%",
                fontSize: "8px",
                color: "#BEBEBE",
                zIndex: 10,
                pointerEvents: "none",
              }}
            >
              loop
            </span>
          </>
        ) : (
          <Handle type="source" position={Position.Right} />
        )}
      </div>
      <div
        style={{
          color: "#fff",
          fontWeight: "bold",
          fontSize: "9px",
          whiteSpace: "nowrap",
        }}
      >
        {props.data?.label ?? ""}
      </div>
    </div>
  );
};

// custom edge 설정
export const CustomEdge = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
}: any) => {
  const { setEdges } = useReactFlow();
  const [hovered, setHovered] = useState(false);

  const isSelfLoop = source === target;
  const isBackwards = !isSelfLoop && sourceX > targetX;

  let edgePath: string;
  let labelX: number;
  let labelY: number;

  if (isSelfLoop) {
    // 자기 자신으로 연결: 위쪽으로 호를 그림
    const loopW = 60;
    const loopH = 80;
    edgePath = `M ${sourceX} ${sourceY} C ${sourceX + loopW} ${sourceY - loopH}, ${targetX - loopW} ${targetY - loopH}, ${targetX} ${targetY}`;
    labelX = (sourceX + targetX) / 2;
    labelY = Math.min(sourceY, targetY) - loopH;
  } else if (isBackwards) {
    // 역방향 연결(루프 귀환): 핸들에서 수평으로 벗어난 뒤 아래로 꺾이는 직각 경로
    const gap = 28; // 핸들에서 벗어나는 수평 거리
    const dx = sourceX - targetX;
    const bottomY = Math.max(sourceY, targetY) + Math.max(60, dx * 0.4);
    edgePath = [
      `M ${sourceX} ${sourceY}`,
      `L ${sourceX + gap} ${sourceY}`,
      `L ${sourceX + gap} ${bottomY}`,
      `L ${targetX - gap} ${bottomY}`,
      `L ${targetX - gap} ${targetY}`,
      `L ${targetX} ${targetY}`,
    ].join(" ");
    labelX = (sourceX + targetX) / 2;
    labelY = bottomY;
  } else {
    [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  }

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEdges((eds) => eds.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
      {/* hover 감지용 투명 넓은 path */}
      <path
        d={edgePath}
        stroke="transparent"
        strokeWidth={20}
        fill="none"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      {hovered && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <button
              onClick={onDelete}
              style={{
                backgroundColor: "#757575",
                width: "15px",
                height: "15px",
                borderRadius: "30%",
                border: "none",
                padding: 0,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export const initialNodes = [
  {
    id: "manual_trigger_node",
    category: "trigger", // 1차 분류 기준 (노드 목록에서 묶음 기준)
    type: "manual", // 2차 분류 기준 - 세부 타입
    position: { x: 0, y: 0 },
    data: {
      label: "매뉴얼 트리거",
      imageUrl: "nodeImages/touch_app.svg",
    },
  },
  {
    id: "chat_trigger_node",
    category: "trigger",
    type: "chat",
    position: { x: 0, y: 0 },
    data: {
      label: "챗 트리거",
      imageUrl: "nodeImages/touch_app.svg",
    },
  },
  {
    id: "schedule_trigger_node",
    category: "trigger",
    type: "schedule",
    position: { x: 0, y: 0 },
    data: {
      label: "스케줄 트리거",
      imageUrl: "nodeImages/touch_app.svg",
    },
  },
  {
    id: "search_node",
    category: "action",
    type: "azure_search",
    position: { x: 0, y: 0 },
    data: {
      label: "Azure Search",
      imageUrl: "nodeImages/document_search.svg",
    },
  },
  {
    id: "generate_answer",
    category: "agent",
    type: "llm_call",
    position: { x: 0, y: 0 },
    data: {
      label: "Agent 호출",
      imageUrl: "nodeImages/chat.svg",
    },
  },
  {
    id: "aggregator",
    category: "utility",
    type: "aggregator",
    position: { x: 0, y: 0 },
    data: {
      label: "Aggregator",
      imageUrl: "nodeImages/edit.svg",
    },
  },
  {
    id: "condition",
    category: "control_flow",
    type: "condition",
    position: { x: 0, y: 0 },
    data: {
      label: "if/else",
      imageUrl: "nodeImages/call_split.svg",
    },
  },
  {
    id: "while_loop",
    category: "control_flow",
    type: "while",
    position: { x: 0, y: 0 },
    data: {
      label: "while문",
      imageUrl: "nodeImages/call_split.svg",
    },
  },
  {
    id: "for_loop",
    category: "control_flow",
    type: "foreach",
    position: { x: 0, y: 0 },
    data: {
      label: "for문",
      imageUrl: "nodeImages/call_split.svg",
    },
  },
  {
    id: "autonomous",
    category: "agent",
    type: "autonomous_agent",
    position: { x: 0, y: 0 },
    data: {
      label: "Autonomous Agent",
      imageUrl: "nodeImages/call_split.svg",
    },
  },
  {
    id: "final_output",
    category: "action",
    type: "output",
    position: { x: 0, y: 0 },
    data: {
      label: "최종 출력",
      imageUrl: "nodeImages/call_split.svg",
    },
  },
  {
    id: "transform",
    category: "action",
    type: "data_transform",
    position: { x: 0, y: 0 },
    data: {
      label: "데이터 변환",
      imageUrl: "nodeImages/call_split.svg",
    },
  },
  {
    id: "report_template",
    category: "action",
    type: "report_template",
    position: { x: 0, y: 0 },
    data: {
      label: "정형 보고서 생성",
      imageUrl: "nodeImages/call_split.svg",
    },
  },
  {
    id: "chart",
    category: "action",
    type: "chart",
    position: { x: 0, y: 0 },
    data: {
      label: "차트 생성",
      imageUrl: "nodeImages/call_split.svg",
    },
  },
];
