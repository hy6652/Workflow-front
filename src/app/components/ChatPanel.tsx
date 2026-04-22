"use client";
import { useEffect, useRef, useState } from "react";
import { WorkflowOutput } from "../interfaces/workflowOutput";
import ChartRenderer from "./ChartRenderer";

interface Message {
  role: "user" | "assistant";
  output: WorkflowOutput;
}

interface Props {
  onSend: (input: string) => Promise<WorkflowOutput>;
  onClose: () => void;
  mode?: "chat" | "manual";
}

function downloadHtml(html: string, title: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function ChatPanel({ onSend, onClose, mode = "chat" }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", output: { kind: "text", text: userMsg } }]);
    setLoading(true);
    try {
      const response = await onSend(userMsg);
      setMessages((prev) => [...prev, { role: "assistant", output: response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", output: { kind: "text", text: "오류가 발생했습니다." } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRun = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await onSend("");
      setMessages((prev) => [...prev, { role: "assistant", output: response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", output: { kind: "text", text: "오류가 발생했습니다." } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "360px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid #333",
        backgroundColor: "#141414",
        overflow: "hidden",
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 16px",
          borderBottom: "1px solid #2a2a2a",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "13px", color: "#ccc", fontWeight: "bold" }}>
            워크플로우 테스트
          </span>
          <span
            style={{
              fontSize: "10px",
              color: mode === "chat" ? "#6c8ebf" : "#7a7a7a",
              backgroundColor: mode === "chat" ? "#1a2a3a" : "#2a2a2a",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            {mode === "chat" ? "챗 트리거" : "매뉴얼 트리거"}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#555",
            cursor: "pointer",
            fontSize: "16px",
            padding: 0,
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>

      {/* 메시지 목록 */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "16px",
        }}
      >
        {messages.length === 0 && !loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              gap: "8px",
              color: "#444",
            }}
          >
            <span style={{ fontSize: "24px" }}>
              {mode === "chat" ? "💬" : "▶"}
            </span>
            <span style={{ fontSize: "12px", textAlign: "center" }}>
              {mode === "chat"
                ? "메시지를 입력하여 워크플로우를 테스트하세요"
                : "실행 버튼을 눌러 워크플로우를 실행하세요"}
            </span>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                color: "#555",
                marginBottom: "3px",
                paddingLeft: msg.role === "user" ? 0 : "4px",
                paddingRight: msg.role === "user" ? "4px" : 0,
              }}
            >
              {msg.role === "user" ? "나" : "워크플로우"}
            </span>
            {msg.output.kind === "chart" ? (
              <ChartRenderer chartConfig={msg.output.chartConfig} />
            ) : msg.output.kind === "report" ? (
              <div style={{ maxWidth: "100%", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#aaa",
                    paddingLeft: "4px",
                  }}
                >
                  보고서: {msg.output.title}
                </div>
                <iframe
                  srcDoc={msg.output.html}
                  title={msg.output.title}
                  style={{
                    width: "320px",
                    height: "450px",
                    border: "1px solid #333",
                    borderRadius: "6px",
                    background: "#fff",
                  }}
                />
                <button
                  onClick={() => downloadHtml(msg.output.kind === "report" ? msg.output.html : "", msg.output.kind === "report" ? msg.output.title : "")}
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    color: "#000",
                    fontSize: "11px",
                    fontWeight: "bold",
                    padding: "5px 12px",
                    cursor: "pointer",
                  }}
                >
                  다운로드
                </button>
              </div>
            ) : (
              <div
                style={{
                  maxWidth: "85%",
                  backgroundColor: msg.role === "user" ? "#2a2a2a" : "#1e1e1e",
                  border: `1px solid ${msg.role === "user" ? "#3a3a3a" : "#2a2a2a"}`,
                  borderRadius:
                    msg.role === "user"
                      ? "12px 12px 2px 12px"
                      : "12px 12px 12px 2px",
                  padding: "9px 12px",
                  fontSize: "12px",
                  color: "#ddd",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  lineHeight: "1.5",
                }}
              >
                {msg.output.text}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                color: "#555",
                marginBottom: "3px",
                paddingLeft: "4px",
              }}
            >
              워크플로우
            </span>
            <div
              style={{
                backgroundColor: "#1e1e1e",
                border: "1px solid #2a2a2a",
                borderRadius: "12px 12px 12px 2px",
                padding: "9px 14px",
                fontSize: "14px",
                color: "#555",
                letterSpacing: "3px",
              }}
            >
              ···
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 입력 영역 */}
      <div
        style={{
          padding: "12px 16px 16px",
          borderTop: "1px solid #2a2a2a",
          flexShrink: 0,
        }}
      >
        {mode === "chat" ? (
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="메시지를 입력하세요..."
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: "#222",
                border: "1px solid #3a3a3a",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "12px",
                padding: "9px 12px",
                outline: "none",
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                backgroundColor: loading || !input.trim() ? "#2a2a2a" : "#fff",
                border: "none",
                borderRadius: "8px",
                color: loading || !input.trim() ? "#555" : "#000",
                cursor: loading || !input.trim() ? "default" : "pointer",
                fontSize: "12px",
                fontWeight: "bold",
                padding: "9px 14px",
                flexShrink: 0,
              }}
            >
              전송
            </button>
          </div>
        ) : (
          <button
            onClick={handleRun}
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: loading ? "#2a2a2a" : "#fff",
              border: "none",
              borderRadius: "8px",
              color: loading ? "#555" : "#000",
              cursor: loading ? "default" : "pointer",
              fontSize: "13px",
              fontWeight: "bold",
              padding: "10px",
            }}
          >
            {loading ? "실행 중..." : "실행"}
          </button>
        )}
      </div>
    </div>
  );
}
