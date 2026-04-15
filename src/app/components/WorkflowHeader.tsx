"use client";

import React from "react";
import { Workflow } from "../interfaces/workflows";

interface WorkflowHeaderProps {
  activeTab: "new" | "saved";
  selectedWorkflow: Workflow | null;
  setActiveTab: (tab: "new" | "saved") => void;
  title: string;
  setTitle: (title: string) => void;
  onReset: () => void;
  onSave: () => void;
}

export default function WorkflowHeader({
  activeTab,
  selectedWorkflow,
  setActiveTab,
  title,
  setTitle,
  onReset,
  onSave,
}: WorkflowHeaderProps) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        borderBottom: "1px solid #333",
        flexShrink: 0,
        height: "60px",
        backgroundColor: "#1a1a1a",
      }}
    >
      {/* 왼쪽: 탭 */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          onClick={() => setActiveTab("new")}
          style={{
            padding: "14px 20px",
            background: "none",
            border: "none",
            color: activeTab === "new" ? "#fff" : "#666",
            borderBottom:
              activeTab === "new" ? "2px solid #fff" : "2px solid transparent",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: activeTab === "new" ? "bold" : "normal",
          }}
        >
          새 워크플로우
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          style={{
            padding: "14px 20px",
            background: "none",
            border: "none",
            color: activeTab === "saved" ? "#fff" : "#666",
            borderBottom:
              activeTab === "saved"
                ? "2px solid #fff"
                : "2px solid transparent",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: activeTab === "saved" ? "bold" : "normal",
          }}
        >
          저장된 워크플로우
        </button>
      </div>

      {/* 오른쪽: 제목 + 버튼 */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="워크플로우 제목"
          style={{
            background: "none",
            border: "none",
            borderBottom: "1px solid #444",
            color: "#fff",
            fontSize: "14px",
            padding: "4px",
            width: "180px",
            outline: "none",
          }}
        />
        <button
          onClick={onReset}
          style={{
            padding: "6px 14px",
            backgroundColor: "#333",
            border: "1px solid #555",
            borderRadius: "6px",
            color: "#fff",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          리셋
        </button>
        <button
          onClick={onSave}
          style={{
            padding: "6px 14px",
            backgroundColor: "#fff",
            border: "none",
            borderRadius: "6px",
            color: "#000",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "bold",
          }}
        >
          저장
        </button>
      </div>
    </header>
  );
}
