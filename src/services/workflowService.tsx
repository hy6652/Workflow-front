import { Workflow } from "@/app/interfaces/workflows";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

export interface APIResponse {
  success: boolean;
  sessionId: string;
  workflowName: string;
  outputs: any[];
  error?: string;
  durationMs: number;
}

export interface RunWorkflowRequest {
  definition: Workflow;
  input: string;
}

export interface APIResponse2 {
  success: boolean;
  workflowJson: string;
}

export const runWorkflowJsonAsync = async (
  request: RunWorkflowRequest,
): Promise<APIResponse> => {
  try {
    const res = await api.post<APIResponse>(
      "/api/v1/orgs/org-001/workflows/run-json",
      request,
    );
    return res.data;
  } catch (err) {
    return {
      success: false,
      sessionId: "",
      workflowName: "",
      outputs: [],
      error: err instanceof Error ? err.message : "알 수 없는 오류",
      durationMs: 0,
    };
  }
};

export const createWorkflow = async (
  input: CreateRequest,
): Promise<APIResponse2> => {
  try {
    const res = await api.post<APIResponse2>(
      "/api/v1/orgs/org-001/workflows/generate-from-nl",
      input,
    );

    console.log(`return ${res.data}`);
    return res.data;
  } catch (err) {
    return {
      success: false,
      workflowJson: "",
    };
  }
};

export interface CreateRequest {
  input: string;
}
