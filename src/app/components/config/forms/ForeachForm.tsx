"use client";

import { useState, useImperativeHandle, Ref } from "react";
import { FormRef, inputStyle, labelStyle, fieldStyle } from "../configTypes";

interface Props {
  initialParameters?: Record<string, any>;
  ref?: Ref<FormRef>;
}

export function ForeachForm({ initialParameters, ref }: Props) {
  const [iterateOver, setIterateOver] = useState<string>(
    initialParameters?.iterateOver ?? "",
  );

  useImperativeHandle(ref, () => ({
    getParameters: () => {
      const params: Record<string, any> = {};
      if (iterateOver.trim()) params.iterateOver = iterateOver.trim();
      return params;
    },
  }), [iterateOver]);

  return (
    <>
      <div style={{ fontSize: "11px", color: "#666", lineHeight: "1.6", padding: "8px 0" }}>
        iterateOver를 지정하지 않으면 이전 노드의 배열을 전달합니다.
      </div>
      <div style={fieldStyle}>
        <span style={labelStyle}>
          iterateOver
          <span style={{ color: "#555", marginLeft: "4px" }}>(선택)</span>
        </span>
        <input
          type="text"
          value={iterateOver}
          onChange={(e) => setIterateOver(e.target.value)}
          placeholder="배열 필드명 (예: items)"
          style={{ ...inputStyle, color: iterateOver ? "#fff" : "#555" }}
        />
      </div>
    </>
  );
}
