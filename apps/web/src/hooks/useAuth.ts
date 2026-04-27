import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchProfile, logoutUser } from "../services/auth.service";
import { clearToken } from "../utils/token";

import type { UserProfile } from "../types/user.types";

export const useAuth = () => {
  const navigate = useNavigate();

  const [user, setUser] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const loadProfile = async () => {
    try {
      const data = await fetchProfile();
      setUser(data.user);
    } catch (err) {
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {}

    const isAdmin = user?.type === "admin";

    clearToken();
    setUser(null);

    navigate(
      isAdmin
        ? "/auth/loginAdmin"
        : "/auth/loginSelector"
    );
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return {
    user,
    loading,
    logout,
    reload: loadProfile,
  };
};