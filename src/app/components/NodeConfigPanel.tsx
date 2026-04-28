"use client";

import { useRef } from "react";
import { FormRef } from "./config/configTypes";
import { ScheduleForm } from "./config/forms/ScheduleForm";
import { AgentForm } from "./config/forms/AgentForm";
import { LlmCallForm } from "./config/forms/LlmCallForm";
import { ConditionForm } from "./config/forms/ConditionForm";
import { WhileForm } from "./config/forms/WhileForm";
import { ForeachForm } from "./config/forms/ForeachForm";
import { AzureSearchForm } from "./config/forms/AzureSearchForm";
import { ReportTemplateForm } from "./config/forms/ReportTemplateForm";
import { ChartForm } from "./config/forms/ChartForm";
import { McpForm } from "./config/forms/McpForm";
import { DataTransformForm } from "./config/forms/DataTransformForm";

interface Props {
  nodeId: string;
  type: string;
  initialParameters?: Record<string, any>;
  onSave: (nodeId: string, parameters: Record<string, any>) => void;
  onClose: () => void;
}

export default function NodeConfigPanel({
  nodeId,
  type,
  initialParameters,
  onSave,
  onClose,
}: Props) {
  const formRef = useRef<FormRef>(null);

  const handleSave = () => {
    onSave(nodeId, formRef.current?.getParameters() ?? {});
  };

  const renderForm = () => {
    const props = { initialParameters, ref: formRef };
    switch (type) {
      case "schedule":
        return <ScheduleForm {...props} />;
      case "autonomous_agent":
        return <AgentForm {...props} />;
      case "llm_call":
        return <LlmCallForm {...props} />;
      case "condition":
        return <ConditionForm {...props} />;
      case "while":
        return <WhileForm {...props} />;
      case "foreach":
        return <ForeachForm {...props} />;
      case "azure_search":
        return <AzureSearchForm {...props} />;
      case "report_template":
        return <ReportTemplateForm {...props} />;
      case "chart":
        return <ChartForm {...props} />;
      case "data_transform":
        return <DataTransformForm {...props} />;
      case "mcp":
        return <McpForm {...props} />;
      case "manual":
        return (
          <div
            style={{
              fontSize: "11px",
              color: "#666",
              lineHeight: "1.6",
              padding: "8px 0",
            }}
          >
            별도 설정 없음.
            <br />
            버튼 클릭 등 외부 이벤트로 실행됩니다.
          </div>
        );
      case "chat":
        return (
          <div
            style={{
              fontSize: "11px",
              color: "#666",
              lineHeight: "1.6",
              padding: "8px 0",
            }}
          >
            별도 설정 없음.
            <br />
            테스트 패널의 채팅 입력이 이 트리거로 전달됩니다.
          </div>
        );
      default:
        return <div style={{ fontSize: "12px", color: "#555" }}>설정 없음</div>;
    }
  };

  return (
    <div
      style={{
        width: "300px",
        borderLeft: "1px solid #333",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        overflowY: "auto",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#888",
            fontSize: "12px",
            cursor: "pointer",
            padding: 0,
          }}
        >
          ← 뒤로
        </button>
        <button
          onClick={handleSave}
          style={{
            padding: "4px 10px",
            backgroundColor: "#fff",
            border: "none",
            borderRadius: "4px",
            color: "#000",
            fontSize: "11px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          저장
        </button>
      </div>
      <div
        style={{
          fontSize: "11px",
          color: "#888",
          fontWeight: "bold",
          borderBottom: "1px solid #333",
          paddingBottom: "8px",
        }}
      >
        {type}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {renderForm()}
      </div>
    </div>
  );
}
