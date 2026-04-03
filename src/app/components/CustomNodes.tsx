import {
  Position,
  Handle,
  useReactFlow,
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
} from "@xyflow/react";
import { useState } from "react";

// custom node 설정
export const ImageNode = (props: any) => {
  const { setNodes, setEdges } = useReactFlow();
  const [hovered, setHovered] = useState(false);

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
            src={props.data.imageUrl}
            alt={props.data.label}
            style={{
              width: "24px",
              height: "24px",
              objectFit: "cover",
            }}
          />
        </div>
        {props.data.label != "트리거" && (
          <Handle type="target" position={Position.Left} />
        )}

        {props.data.category === "condition" ? (
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
        {props.data.label}
      </div>
    </div>
  );
};

// custom edge 설정
export const CustomEdge = ({
  id,
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

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

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
    id: "manual_trigger-node",
    type: "imageNode",
    // category: "manual",
    position: { x: 0, y: 0 },
    data: {
      label: "트리거",
      imageUrl: "nodeImages/touch_app.svg",
      // category: "manual",
    },
  },
  {
    id: "search_node",
    type: "imageNode",
    // category: "azure_search",
    position: { x: 0, y: 0 },
    data: {
      label: "Azure Search",
      imageUrl: "nodeImages/document_search.svg",
    },
  },
  {
    id: "generate_answer",
    type: "imageNode",
    // category: "llm_call",
    position: { x: 0, y: 0 },
    data: {
      label: "Agent 답변 생성",
      imageUrl: "nodeImages/chat.svg",
    },
  },
  {
    id: "write_notion",
    type: "imageNode",
    // category: "autonomous_agent",
    position: { x: 0, y: 0 },
    data: {
      label: "노션 작성",
      imageUrl: "nodeImages/edit.svg",
    },
  },
  {
    id: "condition",
    type: "imageNode",
    position: { x: 0, y: 0 },
    data: {
      label: "if/else",
      imageUrl: "nodeImages/call_split.svg",
      category: "condition",
    },
  },
];
