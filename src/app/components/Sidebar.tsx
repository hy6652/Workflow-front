import { Node, useReactFlow, XYPosition } from "@xyflow/react";
import { useCallback, useState } from "react";
import { OnDropAction, useDnD, useDnDPosition } from "../context/DnDContext";
let id = 0;
const getId = () => `dndnode_${id++}`;

export interface NodeProps {
  nodes: Node[] | null;
}

export default function SideBar(props: NodeProps) {
  //   const [_, setType] = useDnD();

  //   const onDragStart = (event: any, node: any) => {
  //     setType!({ type: node.type, data: node.data });
  //     event.dataTransfer.effectAllowed = "move";
  //   };

  const { onDragStart, isDragging } = useDnD();
  const [type, setType] = useState<string | null>(null);
  const [dragNode, setDragNode] = useState<{
    label: string;
    imageUrl: string;
  } | null>(null);

  const { setNodes } = useReactFlow();

  const createAddNewNode = useCallback(
    (
      nodeType: string,
      label: string,
      imageUrl: string,
      category?: string,
    ): OnDropAction => {
      return ({ position }: { position: XYPosition }) => {
        const newNode = {
          id: getId(),
          type: nodeType,
          position,
          data: {
            label: `${label}`,
            imageUrl: imageUrl,
            ...(category && { category }),
          },
        };

        setNodes((nds) => nds.concat(newNode));
        setType(null);
      };
    },
    [setNodes, setType],
  );
  return (
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
        노드 목록
      </div>
      {isDragging && (
        <DragGhost
          type={type}
          label={dragNode?.label}
          imageUrl={dragNode?.imageUrl}
        />
      )}
      {props.nodes?.map((node: any, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #333",
            cursor: "grab",
            backgroundColor: "#222",
          }}
          onPointerDown={(event) => {
            setType(node.type);
            setDragNode({
              label: node.data.label,
              imageUrl: node.data.imageUrl,
            });
            onDragStart(
              event,
              createAddNewNode(
                node.type,
                node.data.label,
                node.data.imageUrl,
                node.data.category,
              ),
            );
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "20%",
              backgroundColor: "#000",
              border: "2px solid #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <img
              src={node.data.imageUrl}
              alt={node.data.label}
              style={{ width: "18px", height: "18px" }}
            />
          </div>
          <span style={{ fontSize: "12px", color: "#fff" }}>
            {node.data.label}
          </span>
        </div>
      ))}
    </div>
  );
}

interface DragGhostProps {
  type: string | null;
  label?: string;
  imageUrl?: string;
}

// 드래그 할 때 고스트 효과
export function DragGhost({ type, label, imageUrl }: DragGhostProps) {
  const { position } = useDnDPosition();

  if (!position) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        pointerEvents: "none",
        zIndex: 9999,
        opacity: 0.85,
        transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
      }}
    >
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
        {imageUrl && (
          <img
            src={imageUrl}
            alt={label}
            style={{ width: "24px", height: "24px", objectFit: "cover" }}
          />
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
        {label}
      </div>
    </div>
  );
}
