import axios from "./axios";

export interface LoginPayload {
  username: string;
  password: string;
  examName?: string;
}

export const loginAdmin = async (payload: LoginPayload) => {
  const res = await axios.post("/api/login", payload);

  return res.data;
};

export const loginSelector = async (payload: LoginPayload) => {
  const res = await axios.post("/api/login", payload);

  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.post("/api/logout");

  return res.data;
};

export const forceLogout = async (payload: LoginPayload) => {
  const res = await axios.post("/api/force-logout", payload);

  return res.data;
};

export const fetchProfile = async () => {
  const res = await axios.get("/api/profile");

  return res.data;
};
