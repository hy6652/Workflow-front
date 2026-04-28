"use client";

import { useState, useImperativeHandle, Ref } from "react";
import { FormRef, DataExpression, inputStyle, labelStyle, fieldStyle } from "../configTypes";

interface Props {
  initialParameters?: Record<string, any>;
  ref?: Ref<FormRef>;
}

export function DataTransformForm({ initialParameters, ref }: Props) {
  const [mappings, setMappings] = useState<DataExpression[]>(
    initialParameters?.mappings ?? [],
  );

  useImperativeHandle(ref, () => ({ getParameters: () => ({ mappings }) }), [mappings]);

  return (
    <div style={fieldStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={labelStyle}>Mappings</span>
        <button
          onClick={() => setMappings((prev) => [...prev, { fields: [], op: "", to: "" }])}
          style={{ fontSize: "10px", backgroundColor: "#333", border: "1px solid #555", borderRadius: "4px", color: "#fff", padding: "2px 6px", cursor: "pointer" }}
        >
          + 추가
        </button>
      </div>
      {mappings.map((mapping, i) => (
        <div key={i} style={{ border: "1px solid #333", borderRadius: "6px", padding: "8px", display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ ...labelStyle, color: "#aaa" }}>Mapping {i + 1}</span>
            <button
              onClick={() => setMappings((prev) => prev.filter((_, idx) => idx !== i))}
              style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "12px", padding: 0, lineHeight: 1 }}
            >
              ✕
            </button>
          </div>
          <div style={fieldStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ ...labelStyle, fontSize: "10px" }}>fields</span>
              <button
                onClick={() => setMappings((prev) => prev.map((m, idx) => idx === i ? { ...m, fields: [...m.fields, ""] } : m))}
                style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "11px", padding: 0 }}
              >
                + 추가
              </button>
            </div>
            {mapping.fields.map((f, fi) => (
              <div key={fi} style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                <input
                  type="text"
                  value={f}
                  onChange={(e) => setMappings((prev) => prev.map((m, idx) => idx === i ? { ...m, fields: m.fields.map((v, vi) => vi === fi ? e.target.value : v) } : m))}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  onClick={() => setMappings((prev) => prev.map((m, idx) => idx === i ? { ...m, fields: m.fields.filter((_, vi) => vi !== fi) } : m))}
                  style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "14px", padding: "0 2px" }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {(["op", "to"] as (keyof DataExpression)[]).map((k) => (
            <div key={k} style={fieldStyle}>
              <span style={{ ...labelStyle, fontSize: "10px" }}>
                {k === "op" ? "op  (rename, copy, delete …)" : k}
              </span>
              <input
                type="text"
                value={mapping[k] as string}
                onChange={(e) => setMappings((prev) => prev.map((m, idx) => idx === i ? { ...m, [k]: e.target.value } : m))}
                style={inputStyle}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
