"use client";

import { Position, Handle, useReactFlow, useNodes } from "@xyflow/react";
import { useState } from "react";

export const ImageNode = (props: any) => {
  const { setNodes, setEdges } = useReactFlow();
  const nodes = useNodes();
  const [hovered, setHovered] = useState(false);

  const currentNode = nodes.find((n) => n.id === props.id);
  const rawType = (currentNode as any)?.type as string | undefined;
  const category = (currentNode as any)?.category as string | undefined;
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
            style={{ width: "24px", height: "24px", objectFit: "cover" }}
          />
        </div>
        {!props.data?.label?.includes("트리거") && (
          <Handle type="target" position={Position.Left} />
        )}

        {type === "condition" ? (
          <>
            <Handle type="source" position={Position.Right} id="true" style={{ top: "25%" }} />
            <Handle type="source" position={Position.Right} id="false" style={{ top: "75%" }} />
            <span style={{ backgroundColor: "#808080", padding: "0px 2px", borderRadius: "20%", position: "absolute", right: "-25px", top: "12%", fontSize: "8px", color: "#BEBEBE", zIndex: 10, pointerEvents: "none" }}>true</span>
            <span style={{ backgroundColor: "#808080", padding: "0px 2px", borderRadius: "20%", position: "absolute", right: "-28px", top: "63%", fontSize: "8px", color: "#BEBEBE", zIndex: 10, pointerEvents: "none" }}>false</span>
          </>
        ) : type === "while" || type === "foreach" ? (
          <>
            <Handle type="source" position={Position.Right} id="done" style={{ top: "25%" }} />
            <Handle type="source" position={Position.Right} id="loop" style={{ top: "75%" }} />
            <span style={{ backgroundColor: "#808080", padding: "0px 2px", borderRadius: "20%", position: "absolute", right: "-28px", top: "12%", fontSize: "8px", color: "#BEBEBE", zIndex: 10, pointerEvents: "none" }}>done</span>
            <span style={{ backgroundColor: "#808080", padding: "0px 2px", borderRadius: "20%", position: "absolute", right: "-26px", top: "63%", fontSize: "8px", color: "#BEBEBE", zIndex: 10, pointerEvents: "none" }}>loop</span>
          </>
        ) : (
          <Handle type="source" position={Position.Right} />
        )}
      </div>
      <div style={{ color: "#fff", fontWeight: "bold", fontSize: "9px", whiteSpace: "nowrap" }}>
        {props.data?.label ?? ""}
      </div>
    </div>
  );
};
