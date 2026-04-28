"use client";

import { Dispatch, SetStateAction } from "react";
import { Expression, inputStyle, labelStyle, fieldStyle } from "./configTypes";

interface Props {
  label: string;
  value: Expression;
  onChange: Dispatch<SetStateAction<Expression>>;
}

export function ExpressionBlock({ label, value, onChange }: Props) {
  return (
    <div style={fieldStyle}>
      <span style={labelStyle}>{label}</span>
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
              value={value[k]}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, [k]: e.target.value }))
              }
              style={inputStyle}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
