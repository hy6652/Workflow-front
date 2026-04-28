"use client";

import { useState, useImperativeHandle, Ref } from "react";
import { FormRef, Expression, inputStyle, labelStyle, fieldStyle } from "../configTypes";
import { ExpressionBlock } from "../ExpressionBlock";

interface Props {
  initialParameters?: Record<string, any>;
  ref?: Ref<FormRef>;
}

export function WhileForm({ initialParameters, ref }: Props) {
  const [maxIterations, setMaxIterations] = useState<number>(
    initialParameters?.maxIterations ?? 10,
  );
  const [doneCondition, setDoneCondition] = useState<Expression>(
    initialParameters?.doneCondition ?? { field: "", op: "", value: "" },
  );
  const [breakCondition, setBreakCondition] = useState<Expression>(
    initialParameters?.breakCondition ?? { field: "", op: "", value: "" },
  );

  useImperativeHandle(ref, () => ({
    getParameters: () => {
      const params: Record<string, any> = { maxIterations };
      if (doneCondition.field.trim()) params.doneCondition = doneCondition;
      if (breakCondition.field.trim()) params.breakCondition = breakCondition;
      return params;
    },
  }), [maxIterations, doneCondition, breakCondition]);

  return (
    <>
      <div style={fieldStyle}>
        <span style={labelStyle}>Max Iterations</span>
        <input type="number" value={maxIterations} onChange={(e) => setMaxIterations(Number(e.target.value))} style={inputStyle} />
      </div>
      <ExpressionBlock label="doneCondition (선택 · done 엣지)" value={doneCondition} onChange={setDoneCondition} />
      <ExpressionBlock label="breakCondition (선택 · break 엣지)" value={breakCondition} onChange={setBreakCondition} />
    </>
  );
}
