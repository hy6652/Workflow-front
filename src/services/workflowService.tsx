import { Workflow } from "@/app/interfaces/workflows";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 12000,
  headers: { "Content-Type": "application/json" },
});

export interface APIResponse<T = void> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface RunWorkflowRequest {
  definition: Workflow;
  input: string;
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
      message: "fail",
    };
  }
};
