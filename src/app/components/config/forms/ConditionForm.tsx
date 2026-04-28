"use client";

import { useState, useImperativeHandle, Ref } from "react";
import { FormRef, Expression, inputStyle, labelStyle, fieldStyle } from "../configTypes";
import { ExpressionBlock } from "../ExpressionBlock";

interface Props {
  initialParameters?: Record<string, any>;
  ref?: Ref<FormRef>;
}

export function ConditionForm({ initialParameters, ref }: Props) {
  const [trueOutput, setTrueOutput] = useState<string>(
    initialParameters?.trueOutput ?? "",
  );
  const [falseOutput, setFalseOutput] = useState<string>(
    initialParameters?.falseOutput ?? "",
  );
  const [expression, setExpression] = useState<Expression>(
    initialParameters?.expression ?? { field: "", op: "", value: "" },
  );

  useImperativeHandle(ref, () => ({ getParameters: () => ({ trueOutput, falseOutput, expression }) }), [trueOutput, falseOutput, expression]);

  return (
    <>
      <div style={fieldStyle}>
        <span style={labelStyle}>True Output</span>
        <input type="text" value={trueOutput} onChange={(e) => setTrueOutput(e.target.value)} style={inputStyle} />
      </div>
      <div style={fieldStyle}>
        <span style={labelStyle}>False Output</span>
        <input type="text" value={falseOutput} onChange={(e) => setFalseOutput(e.target.value)} style={inputStyle} />
      </div>
      <ExpressionBlock label="Expression" value={expression} onChange={setExpression} />
    </>
  );
}
