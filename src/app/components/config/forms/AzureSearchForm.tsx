"use client";

import { useState, useImperativeHandle, Ref } from "react";
import { FormRef, inputStyle, labelStyle, fieldStyle } from "../configTypes";

interface Props {
  initialParameters?: Record<string, any>;
  ref?: Ref<FormRef>;
}

export function AzureSearchForm({ initialParameters, ref }: Props) {
  const [top, setTop] = useState<number>(initialParameters?.top ?? 5);
  const [queryField, setQueryField] = useState<string>(
    initialParameters?.queryField ?? "question",
  );

  useImperativeHandle(ref, () => ({ getParameters: () => ({ top, queryField }) }), [top, queryField]);

  return (
    <>
      <div style={fieldStyle}>
        <span style={labelStyle}>Top</span>
        <input type="number" value={top} onChange={(e) => setTop(Number(e.target.value))} style={inputStyle} />
      </div>
      <div style={fieldStyle}>
        <span style={labelStyle}>Query Field</span>
        <input type="text" value={queryField} onChange={(e) => setQueryField(e.target.value)} style={inputStyle} />
      </div>
    </>
  );
}
