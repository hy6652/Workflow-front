"use client";

import { useImperativeHandle, Ref } from "react";
import { FormRef } from "../configTypes";
import reportParameters from "../../../../../sample/report_parameters.json";

interface Props {
  initialParameters?: Record<string, any>;
  ref?: Ref<FormRef>;
}

export function ReportTemplateForm({ ref }: Props) {
  useImperativeHandle(ref, () => ({
    getParameters: () => ({ sections: reportParameters.sections }),
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ fontSize: "11px", color: "#888" }}>
        고정된 섹션 스키마를 사용합니다. 저장 시 자동으로 적용됩니다.
      </div>
      {reportParameters.sections.map((section) => (
        <div
          key={section.name}
          style={{ border: "1px solid #333", borderRadius: "6px", padding: "8px", display: "flex", flexDirection: "column", gap: "2px" }}
        >
          <span style={{ fontSize: "11px", color: "#ccc", fontWeight: "bold" }}>{section.name}</span>
          <span style={{ fontSize: "10px", color: "#666" }}>{section.description}</span>
        </div>
      ))}
    </div>
  );
}
