import React from "react";

export type ToolItem = {
  type: string;
  provider: string;
  endpoint: string;
  name: string;
  description: string;
  toolName: string;
  serverAlias: string;
};

export type Expression = {
  field: string;
  op: string;
  value: string;
};

export type DataExpression = {
  fields: string[];
  op: string;
  to: string;
};

export interface FormRef {
  getParameters: () => Record<string, any>;
}

export const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#2a2a2a",
  border: "1px solid #444",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "11px",
  padding: "6px 8px",
  outline: "none",
  boxSizing: "border-box",
};

export const labelStyle: React.CSSProperties = {
  fontSize: "11px",
  color: "#888",
};

export const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

export const TOOL_FIELDS: (keyof ToolItem)[] = [
  "type",
  "provider",
  "endpoint",
  "name",
  "description",
  "toolName",
  "serverAlias",
];

export const EMPTY_TOOL: ToolItem = {
  type: "",
  provider: "",
  endpoint: "",
  name: "",
  description: "",
  toolName: "",
  serverAlias: "",
};
