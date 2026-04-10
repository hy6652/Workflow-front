"use client";
import { useRef, useState } from "react";
import { APIResponse } from "@/services/workflowService";

interface Props {
  result: APIResponse | null;
  onClose: () => void;
}

export default function WorkflowResultPanel({ result, onClose }: Props) {
  const [height, setHeight] = useState(160);
  const dragStartY = useRef<number | null>(null);
  const dragStartHeight = useRef<number>(160);

  const onHandleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragStartY.current = e.clientY;
    dragStartHeight.current = height;

    const onMouseMove = (e: MouseEvent) => {
      if (dragStartY.current === null) return;
      const delta = dragStartY.current - e.clientY;
      setHeight(Math.max(80, Math.min(500, dragStartHeight.current + delta)));
    };

    const onMouseUp = () => {
      dragStartY.current = null;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const outputText = result
    ? (result.outputs?.[0]?.Data?.text ??
       result.outputs?.[0]?.data?.text ??
       (result.outputs?.[0] != null
         ? JSON.stringify(result.outputs[0], null, 2)
         : null))
    : null;

  return (
    <div
      style={{
        height: `${height}px`,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        borderTop: "1px solid #333",
        backgroundColor: "#1a1a1a",
      }}
    >
      {/* 드래그 핸들 */}
      <div
        onMouseDown={onHandleMouseDown}
        style={{
          height: "6px",
          cursor: "n-resize",
          backgroundColor: "#2a2a2a",
          flexShrink: 0,
        }}
      />

      {/* 헤더 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 16px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {result && (
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: result.success ? "#4caf50" : "#f44336",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
          )}
          <span style={{ fontSize: "12px", color: "#aaa", fontWeight: "bold" }}>
            {result
              ? result.success ? "실행 완료" : "실행 실패"
              : "실행 결과"}
          </span>
          {result && result.durationMs > 0 && (
            <span style={{ fontSize: "11px", color: "#555" }}>
              {result.durationMs}ms
            </span>
          )}
        </div>
        {result && (
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#555",
              cursor: "pointer",
              fontSize: "14px",
              padding: 0,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* 결과 텍스트 */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          margin: "0 16px 12px",
          backgroundColor: "#111",
          border: "1px solid #2a2a2a",
          borderRadius: "4px",
          padding: "8px 10px",
          fontSize: "12px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          color: result
            ? result.success ? "#e0e0e0" : "#f44336"
            : "#444",
        }}
      >
        {result
          ? result.success
            ? (outputText ?? "결과 없음")
            : (result.error ?? "알 수 없는 오류")
          : "워크플로우를 실행하면 결과가 여기에 표시됩니다."}
      </div>
    </div>
  );
}
