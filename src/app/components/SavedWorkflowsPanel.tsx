"use client";

import React from "react";

interface SavedWorkflow {
  id: string;
  name: string;
  fileName: string;
}

interface Props {
  workflows: SavedWorkflow[];
  onSelect?: (workflow: SavedWorkflow) => void;
}

export default function SavedWorkflowsPanel({ workflows, onSelect }: Props) {
  return (
    <div
      style={{
        width: "250px",
        borderLeft: "1px solid #333",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        overflowY: "auto",
        flexShrink: 0,
        backgroundColor: "#1a1a1a",
      }}
    >
      <div style={{ fontSize: "12px", color: "#888", marginBottom: "8px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        저장된 워크플로우
      </div>
      {workflows.length === 0 ? (
        <div style={{ fontSize: "12px", color: "#555", textAlign: "center", marginTop: "20px" }}>
          저장된 워크플로우가 없습니다.
        </div>
      ) : (
        workflows.map((wf) => (
          <div
            key={wf.id}
            onClick={() => onSelect?.(wf)}
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #333", backgroundColor: "#222", cursor: "pointer", transition: "all 0.2s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#555"; e.currentTarget.style.backgroundColor = "#2a2a2a"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.backgroundColor = "#222"; }}
          >
            <div style={{ fontSize: "13px", color: "#fff", fontWeight: "bold", marginBottom: "4px" }}>{wf.name}</div>
            <div style={{ fontSize: "11px", color: "#666", fontFamily: "monospace" }}>{wf.fileName}</div>
          </div>
        ))
      )}
    </div>
  );
}
