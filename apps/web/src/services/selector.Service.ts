import axios from "./axios";

// Types
export interface Selector {
  id: number;
  username: string;
  mobileNumber: string;
}

export interface SelectorPayload {
  username: string;
  password: string;
  mobileNumber: string;
  type?: string;
}

/**
 * Fetch all selectors
 * GET /api/users?type=selector
 */
export const fetchSelectors = async (): Promise<Selector[]> => {
  const response = await axios.get(
    "/api/users?type=selector"
  );

  return response.data;
};

/**
 * Register selector
 * POST /api/register
 */
export const registerSelector = async (
  payload: SelectorPayload
) => {
  const response = await axios.post(
    "/api/register",
    {
      ...payload,
      type: "selector",
    }
  );

  return response.data;
};