"use client";

import { useState, useImperativeHandle, Ref } from "react";
import { FormRef, inputStyle, labelStyle, fieldStyle } from "../configTypes";

interface Props {
  initialParameters?: Record<string, any>;
  ref?: Ref<FormRef>;
}

export function LlmCallForm({ initialParameters, ref }: Props) {
  const [systemPrompt, setSystemPrompt] = useState<string>(
    initialParameters?.systemPrompt ?? "",
  );
  const [outputToken, setOutputToken] = useState<number | null>(
    initialParameters?.outputToken ?? null,
  );

  useImperativeHandle(ref, () => ({ getParameters: () => ({ systemPrompt, outputToken }) }), [systemPrompt, outputToken]);

  return (
    <>
      <div style={fieldStyle}>
        <span style={labelStyle}>systemPrompt</span>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          rows={15}
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
    </>
  );
}
