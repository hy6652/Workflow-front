"use client";

import { Node, useReactFlow, XYPosition } from "@xyflow/react";
import { useCallback, useState } from "react";
import { OnDropAction, useDnD, useDnDPosition } from "../context/DnDContext";
import reportParameters from "../../../sample/report_parameters.json";
import { WorkflowOutput } from "../interfaces/workflowOutput";

let nodeCount = 1;
const getId = () => `node_${nodeCount++}`;

const CATEGORY_LABELS: Record<string, string> = {
  trigger: "트리거",
  action: "액션",
  agent: "에이전트",
  utility: "유틸리티",
  control_flow: "제어 흐름",
};

export interface NodeProps {
  nodes: Node[] | null;
  onBack?: () => void;
  handleCreate: (input: string) => void;
  onTest?: (input: string) => Promise<WorkflowOutput>;
  showChat?: boolean;
  onToggleChat?: () => void;
}

export default function SideBar(props: NodeProps) {
  const { onDragStart, isDragging } = useDnD();
  const [showNLInput, setShowNLInput] = useState(false);
  const [nlText, setNlText] = useState("");
  const [dragNode, setDragNode] = useState<{
    label: string;
    imageUrl: string;
  } | null>(null);
  // 닫힌 카테고리 목록 (기본 모두 열림)
  const [closedCategories, setClosedCategories] = useState<Set<string>>(
    new Set(),
  );

  const { setNodes } = useReactFlow();

  const toggleCategory = (cat: string) => {
    setClosedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  // nodes를 category 기준으로 그룹핑 (삽입 순서 유지)
  const groupedNodes = (props.nodes ?? []).reduce(
    (acc, node: any) => {
      const cat: string = node.category ?? "기타";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(node);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  const createAddNewNode = useCallback(
    (
      nodeType: string,
      label: string,
      imageUrl: string,
      category: string,
    ): OnDropAction => {
      return ({ position }: { position: XYPosition }) => {
        const newNode: any = {
          id: getId(),
          type: nodeType,
          category,
          position,
          data: { label: `${label}`, imageUrl },
          ...(nodeType === "report_template" && {
            parameters: { sections: reportParameters.sections },
          }),
        };
        setNodes((nds) => nds.concat(newNode));
      };
    },
    [setNodes],
  );

  return (
    <div
      style={{
        width: "220px",
        borderLeft: "1px solid #333",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {props.onBack && (
        <button
          onClick={props.onBack}
          style={{
            background: "none",
            border: "none",
            color: "#888",
            fontSize: "12px",
            cursor: "pointer",
            padding: 0,
            textAlign: "left",
            marginBottom: "4px",
            flexShrink: 0,
          }}
        >
          ← 목록
        </button>
      )}

      {showNLInput ? (
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <button
              onClick={() => setShowNLInput(false)}
              style={{
                background: "none",
                border: "none",
                color: "#888",
                fontSize: "12px",
                cursor: "pointer",
                padding: 0,
              }}
            >
              ← 뒤로
            </button>
            <span
              style={{ fontSize: "12px", color: "#888", fontWeight: "bold" }}
            >
              워크플로우 생성
            </span>
          </div>
          <textarea
            value={nlText}
            onChange={(e) => setNlText(e.target.value)}
            placeholder="워크플로우를 자연어로 설명해주세요."
            rows={8}
            style={{
              width: "100%",
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              borderRadius: "4px",
              color: "#fff",
              fontSize: "11px",
              padding: "6px 8px",
              outline: "none",
              resize: "vertical",
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={() => props.handleCreate(nlText)}
            style={{
              backgroundColor: "#fff",
              border: "none",
              borderRadius: "4px",
              color: "#000",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: "bold",
              padding: "6px",
            }}
          >
            생성
          </button>
        </div>
      ) : (
        <>
          {/* 헤더 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
              flexShrink: 0,
            }}
          >
            <span
              style={{ fontSize: "12px", color: "#888", fontWeight: "bold" }}
            >
              노드 목록
            </span>
            <button
              onClick={() => setShowNLInput(true)}
              title="자연어로 워크플로우 생성"
              style={{
                background: "none",
                border: "1px solid #444",
                borderRadius: "4px",
                color: "#aaa",
                cursor: "pointer",
                fontSize: "12px",
                padding: "2px 6px",
                lineHeight: 1.4,
              }}
            >
              ✦
            </button>
          </div>

          {isDragging && (
            <DragGhost
              label={dragNode?.label}
              imageUrl={dragNode?.imageUrl}
            />
          )}

          {/* 카테고리별 노드 목록 */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            {Object.entries(groupedNodes).map(([category, categoryNodes]) => {
              const isOpen = !closedCategories.has(category);
              return (
                <div key={category}>
                  {/* 카테고리 헤더 */}
                  <div
                    onClick={() => toggleCategory(category)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "5px 4px",
                      cursor: "pointer",
                      userSelect: "none",
                      borderRadius: "4px",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.backgroundColor =
                        "#222";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.backgroundColor =
                        "transparent";
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#666",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {CATEGORY_LABELS[category] ?? category}
                    </span>
                    <span style={{ fontSize: "10px", color: "#555" }}>
                      {isOpen ? "▾" : "▸"}
                    </span>
                  </div>

                  {/* 카테고리 내 노드 목록 */}
                  {isOpen && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        paddingLeft: "4px",
                        marginBottom: "4px",
                      }}
                    >
                      {categoryNodes.map((node: any, index: number) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "8px 10px",
                            borderRadius: "8px",
                            border: "1px solid #2a2a2a",
                            cursor: "grab",
                            backgroundColor: "#1e1e1e",
                          }}
                          onPointerDown={(event) => {
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
                                node.category,
                              ),
                            );
                          }}
                        >
                          <div
                            style={{
                              width: "30px",
                              height: "30px",
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
                              style={{ width: "16px", height: "16px" }}
                            />
                          </div>
                          <span style={{ fontSize: "11px", color: "#ccc" }}>
                            {node.data.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 테스트하기 버튼 */}
          {props.onTest && props.onToggleChat && (
            <button
              onClick={props.onToggleChat}
              style={{
                marginTop: "8px",
                backgroundColor: props.showChat ? "#333" : "#fff",
                border: "none",
                borderRadius: "4px",
                color: props.showChat ? "#aaa" : "#000",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: "bold",
                padding: "7px",
                flexShrink: 0,
              }}
            >
              {props.showChat ? "테스트 닫기" : "테스트하기"}
            </button>
          )}
        </>
      )}
    </div>
  );
}

interface DragGhostProps {
  label?: string;
  imageUrl?: string;
}

export function DragGhost({ label, imageUrl }: DragGhostProps) {
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
