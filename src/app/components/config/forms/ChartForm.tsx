"use client";

import { useState, useImperativeHandle, Ref } from "react";
import { FormRef, inputStyle, labelStyle, fieldStyle } from "../configTypes";

interface Props {
  initialParameters?: Record<string, any>;
  ref?: Ref<FormRef>;
}

export function ChartForm({ initialParameters, ref }: Props) {
  const [chartType, setChartType] = useState<string>(
    initialParameters?.chartType ?? "",
  );
  const [chartPrompt, setChartPrompt] = useState<string>(
    initialParameters?.chartPrompt ?? "",
  );

  useImperativeHandle(ref, () => ({ getParameters: () => ({ chartType, chartPrompt }) }), [chartType, chartPrompt]);

  return (
    <>
      <div style={fieldStyle}>
        <span style={labelStyle}>Chart Type</span>
        <input type="text" value={chartType} onChange={(e) => setChartType(e.target.value)} style={inputStyle} />
      </div>
      <div style={fieldStyle}>
        <span style={labelStyle}>prompt</span>
        <textarea
          value={chartPrompt}
          onChange={(e) => setChartPrompt(e.target.value)}
          style={{ ...inputStyle, resize: "vertical" }}
          rows={4}
        />
      </div>
    </>
  );
}
