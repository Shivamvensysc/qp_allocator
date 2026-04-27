import axios from "./axios";
import type { NavigateFunction } from "react-router-dom";

export interface AllocationDataResponse {
  subjects: any[];
  shifts: any[];
  exam: any;
  ssData: any;
  currentIterations: any[];
  votingResults?: {
    metrics: Record<number, number>;
    isTie: boolean;
    candidates: number[];
    finalWinner: number | null;
  };
}

export interface RandomizationRequest {
  subjectId: string;
  shiftId: string;
  examId: string;
  iterationIndex?: number;
}

export interface RandomizationResponse {
  iterations: Array<{
    iterationNum: number;
    selectedSet: number;
    ts: string;
  }>;
  isComplete: boolean;
  isTie: boolean;
  candidates: number[];
  winner?: number;
  metadata: {
    votingMetrics: Record<number, number>;
  };
  error?: string;
}

export interface TieResolutionRequest {
  subjectId: string;
  shiftId: string;
  candidates: number[];
}

export interface TieResolutionResponse {
  finalSet: number;
  finalWinner?: number;
}

/**
 * Fetch allocation data for randomization
 */
export const fetchAllocationData = async (
  examId: string,
  subjectId: string,
  shiftId: string,
  navigate?: NavigateFunction,
): Promise<AllocationDataResponse> => {
  const response = await axios.get(
    `/api/allocations/data?examId=${examId}&subjectId=${subjectId}&shiftId=${shiftId}`,
  );
  return response.data;
};

/**
 * Perform randomization iteration
 */
export const performRandomization = async (
  request: RandomizationRequest,
  signal?: AbortSignal,
  navigate?: NavigateFunction,
): Promise<RandomizationResponse> => {
  const response = await axios.post("/api/allocations/randomize", request, {
    signal,
  });
  return response.data;
};

/**
 * Resolve tie between candidates
 */
export const resolveTie = async (
  request: TieResolutionRequest,
  navigate?: NavigateFunction,
): Promise<TieResolutionResponse> => {
  const response = await axios.post("/api/allocations/resolve-tie", request);
  return response.data;
};
