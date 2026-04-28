"use client";

import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
} from "@xyflow/react";
import { useState } from "react";

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
    const loopW = 60;
    const loopH = 80;
    edgePath = `M ${sourceX} ${sourceY} C ${sourceX + loopW} ${sourceY - loopH}, ${targetX - loopW} ${targetY - loopH}, ${targetX} ${targetY}`;
    labelX = (sourceX + targetX) / 2;
    labelY = Math.min(sourceY, targetY) - loopH;
  } else if (isBackwards) {
    const gap = 28;
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

  const deleteButtonStyle: React.CSSProperties = {
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
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
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
            <button onClick={onDelete} style={deleteButtonStyle}>
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
