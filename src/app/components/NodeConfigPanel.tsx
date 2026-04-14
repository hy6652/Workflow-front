"use client";
import { useState } from "react";

type ToolItem = {
  type: string;
  provider: string;
  endpoint: string;
  name: string;
  description: string;
  toolName: string;
  serverAlias: string;
};

type Expression = {
  field: string;
  op: string;
  value: string;
};

interface Props {
  nodeId: string;
  type: string;
  initialParameters?: Record<string, any>;
  onSave: (nodeId: string, parameters: Record<string, any>) => void;
  onClose: () => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#2a2a2a",
  border: "1px solid #444",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "11px",
  padding: "6px 8px",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: "11px",
  color: "#888",
};

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const TOOL_FIELDS: (keyof ToolItem)[] = [
  "type",
  "provider",
  "endpoint",
  "name",
  "description",
  "toolName",
  "serverAlias",
];

const EMPTY_TOOL: ToolItem = {
  type: "",
  provider: "",
  endpoint: "",
  name: "",
  description: "",
  toolName: "",
  serverAlias: "",
};

export default function NodeConfigPanel({
  nodeId,
  type,
  initialParameters,
  onSave,
  onClose,
}: Props) {
  // manual (trigger)
  const [inputJson, setInputJson] = useState<string>(
    initialParameters?.input ?? "",
  );

  // autonomous_agent
  const [agentSystemPrompt, setAgentSystemPrompt] = useState<string>(
    initialParameters?.systemPrompt ?? "",
  );
  const [tools, setTools] = useState<ToolItem[]>(
    initialParameters?.tools ?? [],
  );

  // llm_call
  const [llmSystemPrompt, setLlmSystemPrompt] = useState<string>(
    initialParameters?.systemPrompt ?? "",
  );
  const [llmPrompt, setLlmPrompt] = useState<string>(
    initialParameters?.prompt ?? "",
  );
  const [outputToken, setOutputToken] = useState<number | null>(
    initialParameters?.outputToken ?? null,
  );
  const [llmOutputToken, setLLMOutputToken] = useState<number | null>(
    initialParameters?.outputToken ?? null,
  );

  // condition
  const [trueOutput, setTrueOutput] = useState<string>(
    initialParameters?.trueOutput ?? "",
  );
  const [falseOutput, setFalseOutput] = useState<string>(
    initialParameters?.falseOutput ?? "",
  );
  const [expression, setExpression] = useState<Expression>(
    initialParameters?.expression ?? { field: "", op: "", value: "" },
  );

  // while
  const [whileExpression, setWhileExpression] = useState<Expression>(
    initialParameters?.expression ?? { field: "", op: "", value: "" },
  );
  const [maxIterations, setMaxIterations] = useState<number>(
    initialParameters?.maxIterations ?? 10,
  );

  // azure_search
  const [top, setTop] = useState<number>(initialParameters?.top ?? 0);
  const [queryField, setQueryField] = useState<string>(
    initialParameters?.queryField ?? "",
  );

  const handleSave = () => {
    let parameters: Record<string, any> = {};
    if (type === "autonomous_agent") {
      parameters = {
        systemPrompt: agentSystemPrompt,
        outputToken: outputToken,
        tools,
      };
    } else if (type === "llm_call") {
      parameters = {
        systemPrompt: llmSystemPrompt,
        prompt: llmPrompt,
        outputToken: llmOutputToken,
      };
    } else if (type === "condition") {
      parameters = { trueOutput, falseOutput, expression };
    } else if (type === "while") {
      parameters = { expression: whileExpression, maxIterations };
    } else if (type === "azure_search") {
      parameters = { top, queryField };
    }
    onSave(nodeId, parameters);
  };

  const addTool = () => setTools((prev) => [...prev, { ...EMPTY_TOOL }]);
  const removeTool = (i: number) =>
    setTools((prev) => prev.filter((_, idx) => idx !== i));
  const updateTool = (i: number, field: keyof ToolItem, value: string) =>
    setTools((prev) =>
      prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)),
    );

  const renderForm = () => {
    if (type === "manual") {
      return (
        <div
          style={{
            fontSize: "11px",
            color: "#666",
            lineHeight: "1.6",
            padding: "8px 0",
          }}
        >
          별도 설정 없음.
          <br />
          버튼 클릭 등 외부 이벤트로 실행됩니다.
        </div>
      );
    }

    if (type === "chat") {
      return (
        <div
          style={{
            fontSize: "11px",
            color: "#666",
            lineHeight: "1.6",
            padding: "8px 0",
          }}
        >
          별도 설정 없음.
          <br />
          테스트 패널의 채팅 입력이 이 트리거로 전달됩니다.
        </div>
      );
    }

    if (type === "autonomous_agent") {
      return (
        <>
          <div style={fieldStyle}>
            <span style={labelStyle}>System Prompt</span>
            <textarea
              value={agentSystemPrompt}
              onChange={(e) => setAgentSystemPrompt(e.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Output Token</span>
            <input
              type="number"
              value={outputToken ?? ""}
              onChange={(e) => setOutputToken(e.target.value === "" ? null : Number(e.target.value))}
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={labelStyle}>Tools</span>
              <button
                onClick={addTool}
                style={{
                  fontSize: "10px",
                  backgroundColor: "#333",
                  border: "1px solid #555",
                  borderRadius: "4px",
                  color: "#fff",
                  padding: "2px 6px",
                  cursor: "pointer",
                }}
              >
                + 추가
              </button>
            </div>
            {tools.map((tool, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #333",
                  borderRadius: "6px",
                  padding: "8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  marginTop: "4px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ ...labelStyle, color: "#aaa" }}>
                    Tool {i + 1}
                  </span>
                  <button
                    onClick={() => removeTool(i)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#666",
                      cursor: "pointer",
                      fontSize: "12px",
                      padding: 0,
                      lineHeight: 1,
                    }}
                  >
                    ✕
                  </button>
                </div>
                {TOOL_FIELDS.map((field) => (
                  <div key={field} style={fieldStyle}>
                    <span style={{ ...labelStyle, fontSize: "10px" }}>
                      {field}
                    </span>
                    <input
                      type="text"
                      value={tool[field]}
                      onChange={(e) => updateTool(i, field, e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      );
    }

    if (type === "llm_call") {
      return (
        <>
          <div style={fieldStyle}>
            <span style={labelStyle}>systemPrompt</span>
            <textarea
              value={llmSystemPrompt}
              onChange={(e) => setLlmSystemPrompt(e.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>prompt</span>
            <textarea
              value={llmPrompt}
              onChange={(e) => setLlmPrompt(e.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Output Token</span>
            <input
              type="number"
              value={llmOutputToken ?? ""}
              onChange={(e) => setLLMOutputToken(e.target.value === "" ? null : Number(e.target.value))}
              style={inputStyle}
            />
          </div>
        </>
      );
    }

    if (type === "condition") {
      return (
        <>
          <div style={fieldStyle}>
            <span style={labelStyle}>True Output</span>
            <input
              type="text"
              value={trueOutput}
              onChange={(e) => setTrueOutput(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>False Output</span>
            <input
              type="text"
              value={falseOutput}
              onChange={(e) => setFalseOutput(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Expression</span>
            <div
              style={{
                border: "1px solid #333",
                borderRadius: "6px",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              {(["field", "op", "value"] as (keyof Expression)[]).map((k) => (
                <div key={k} style={fieldStyle}>
                  <span style={{ ...labelStyle, fontSize: "10px" }}>
                    {k === "op" ? "op  (gt, le, equals …)" : k}
                  </span>
                  <input
                    type="text"
                    value={expression[k]}
                    onChange={(e) =>
                      setExpression((prev) => ({
                        ...prev,
                        [k]: e.target.value,
                      }))
                    }
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      );
    }

    if (type === "while") {
      return (
        <>
          <div style={fieldStyle}>
            <span style={labelStyle}>종료 조건</span>
            <div
              style={{
                border: "1px solid #333",
                borderRadius: "6px",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              {(["field", "op", "value"] as (keyof Expression)[]).map((k) => (
                <div key={k} style={fieldStyle}>
                  <span style={{ ...labelStyle, fontSize: "10px" }}>
                    {k === "op" ? "op  (gt, le, equals …)" : k}
                  </span>
                  <input
                    type="text"
                    value={whileExpression[k]}
                    onChange={(e) =>
                      setWhileExpression((prev) => ({
                        ...prev,
                        [k]: e.target.value,
                      }))
                    }
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Max Iterations</span>
            <input
              type="number"
              value={maxIterations}
              onChange={(e) => setMaxIterations(Number(e.target.value))}
              style={inputStyle}
            />
          </div>
        </>
      );
    }

    if (type === "azure_search") {
      return (
        <>
          <div style={fieldStyle}>
            <span style={labelStyle}>Top</span>
            <input
              type="number"
              value={top}
              onChange={(e) => setTop(Number(e.target.value))}
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Query Field</span>
            <input
              type="text"
              value={queryField}
              onChange={(e) => setQueryField(e.target.value)}
              style={inputStyle}
            />
          </div>
        </>
      );
    }

    return <div style={{ fontSize: "12px", color: "#555" }}>설정 없음</div>;
  };

  return (
    <div
      style={{
        width: "220px",
        borderLeft: "1px solid #333",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        overflowY: "auto",
        flexShrink: 0,
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={onClose}
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
        <button
          onClick={handleSave}
          style={{
            padding: "4px 10px",
            backgroundColor: "#fff",
            border: "none",
            borderRadius: "4px",
            color: "#000",
            fontSize: "11px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          저장
        </button>
      </div>

      {/* 카테고리 표시 */}
      <div
        style={{
          fontSize: "11px",
          color: "#888",
          fontWeight: "bold",
          borderBottom: "1px solid #333",
          paddingBottom: "8px",
        }}
      >
        {type}
      </div>

      {/* 폼 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {renderForm()}
      </div>
    </div>
  );
}
