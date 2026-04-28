"use client";

import { useState, useImperativeHandle, Ref } from "react";
import {
  FormRef,
  ToolItem,
  TOOL_FIELDS,
  EMPTY_TOOL,
  inputStyle,
  labelStyle,
  fieldStyle,
} from "../configTypes";

interface Props {
  initialParameters?: Record<string, any>;
  ref?: Ref<FormRef>;
}

export function AgentForm({ initialParameters, ref }: Props) {
  const [systemPrompt, setSystemPrompt] = useState<string>(
    initialParameters?.systemPrompt ?? "",
  );
  const [outputToken, setOutputToken] = useState<number | null>(
    initialParameters?.outputToken ?? null,
  );
  const [tools, setTools] = useState<ToolItem[]>(
    initialParameters?.tools ?? [],
  );

  useImperativeHandle(ref, () => ({ getParameters: () => ({ systemPrompt, outputToken, tools }) }), [systemPrompt, outputToken, tools]);

  const addTool = () => setTools((prev) => [...prev, { ...EMPTY_TOOL }]);
  const removeTool = (i: number) => setTools((prev) => prev.filter((_, idx) => idx !== i));
  const updateTool = (i: number, field: keyof ToolItem, value: string) =>
    setTools((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)));

  return (
    <>
      <div style={fieldStyle}>
        <span style={labelStyle}>System Prompt</span>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={labelStyle}>Tools</span>
          <button
            onClick={addTool}
            style={{ fontSize: "10px", backgroundColor: "#333", border: "1px solid #555", borderRadius: "4px", color: "#fff", padding: "2px 6px", cursor: "pointer" }}
          >
            + 추가
          </button>
        </div>
        {tools.map((tool, i) => (
          <div key={i} style={{ border: "1px solid #333", borderRadius: "6px", padding: "8px", display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ ...labelStyle, color: "#aaa" }}>Tool {i + 1}</span>
              <button onClick={() => removeTool(i)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "12px", padding: 0, lineHeight: 1 }}>✕</button>
            </div>
            {TOOL_FIELDS.map((field) => (
              <div key={field} style={fieldStyle}>
                <span style={{ ...labelStyle, fontSize: "10px" }}>{field}</span>
                <input type="text" value={tool[field]} onChange={(e) => updateTool(i, field, e.target.value)} style={inputStyle} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
