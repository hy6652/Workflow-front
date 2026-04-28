"use client";

import { useState, useImperativeHandle, Ref } from "react";
import { FormRef, inputStyle, labelStyle, fieldStyle } from "../configTypes";

interface Props {
  initialParameters?: Record<string, any>;
  ref?: Ref<FormRef>;
}

export function McpForm({ initialParameters, ref }: Props) {
  const [serverAlias, setServerAlias] = useState<string>(
    initialParameters?.serverAlias ?? "",
  );
  const [toolName, setToolName] = useState<string>(
    initialParameters?.toolName ?? "",
  );
  const [toolInputPairs, setToolInputPairs] = useState<{ key: string; value: string }[]>(
    Object.entries(initialParameters?.toolInput ?? {}).map(([k, v]) => ({
      key: k,
      value: String(v),
    })),
  );

  useImperativeHandle(ref, () => ({
    getParameters: () => ({
      serverAlias,
      toolName,
      toolInput: Object.fromEntries(
        toolInputPairs.filter((p) => p.key.trim()).map((p) => [p.key, p.value]),
      ),
    }),
  }), [serverAlias, toolName, toolInputPairs]);

  return (
    <>
      <div style={fieldStyle}>
        <span style={labelStyle}>MCP Server Alias</span>
        <input type="text" value={serverAlias} onChange={(e) => setServerAlias(e.target.value)} style={inputStyle} />
      </div>
      <div style={fieldStyle}>
        <span style={labelStyle}>MCP Tool Name</span>
        <input type="text" value={toolName} onChange={(e) => setToolName(e.target.value)} style={inputStyle} />
      </div>
      <div style={fieldStyle}>
        <span style={labelStyle}>Tool Input</span>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {toolInputPairs.map((pair, i) => (
            <div key={i} style={{ display: "flex", gap: "4px", alignItems: "center" }}>
              <input
                type="text"
                placeholder="key"
                value={pair.key}
                onChange={(e) => setToolInputPairs((prev) => prev.map((p, idx) => idx === i ? { ...p, key: e.target.value } : p))}
                style={{ ...inputStyle, flex: 1 }}
              />
              <input
                type="text"
                placeholder="value"
                value={pair.value}
                onChange={(e) => setToolInputPairs((prev) => prev.map((p, idx) => idx === i ? { ...p, value: e.target.value } : p))}
                style={{ ...inputStyle, flex: 2 }}
              />
              <button
                onClick={() => setToolInputPairs((prev) => prev.filter((_, idx) => idx !== i))}
                style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "14px", padding: "0 2px" }}
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={() => setToolInputPairs((prev) => [...prev, { key: "", value: "" }])}
            style={{ ...inputStyle, cursor: "pointer", color: "#888", textAlign: "left" }}
          >
            + Add
          </button>
        </div>
      </div>
    </>
  );
}
