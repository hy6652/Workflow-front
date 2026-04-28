"use client";

import { useState, useImperativeHandle, Ref } from "react";
import { FormRef, inputStyle, labelStyle, fieldStyle } from "../configTypes";

interface Props {
  initialParameters?: Record<string, any>;
  ref?: Ref<FormRef>;
}

export function ScheduleForm({ initialParameters, ref }: Props) {
  const [cronExpression, setCronExpression] = useState<string>(
    initialParameters?.cronExpression ?? "",
  );
  const [timezone, setTimezone] = useState<string>(
    initialParameters?.timezone ?? "UTC",
  );

  useImperativeHandle(ref, () => ({ getParameters: () => ({ cronExpression, timezone }) }), [cronExpression, timezone]);

  return (
    <>
      <div style={fieldStyle}>
        <span style={labelStyle}>Cron Expression</span>
        <input value={cronExpression} onChange={(e) => setCronExpression(e.target.value)} style={inputStyle} />
      </div>
      <div style={fieldStyle}>
        <span style={labelStyle}>Time Zone</span>
        <input value={timezone} onChange={(e) => setTimezone(e.target.value)} style={inputStyle} />
      </div>
    </>
  );
}
