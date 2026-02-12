import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api, { setAccessToken } from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveToken = useCallback((token) => {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
    setAccessToken(token);
  }, []);

  const loadSession = useCallback(async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
      setLoading(false);
      return;
    } catch (error) {
      try {
        const refresh = await api.post("/auth/refresh");
        saveToken(refresh.data.accessToken);
        setUser(refresh.data.user);
      } catch (refreshError) {
        saveToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
  }, [saveToken]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const requestRegisterOtp = async (payload) => {
    const response = await api.post("/auth/register/request-otp", {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      role: payload.role,
      termsAccepted: payload.termsAccepted
    });
    return response.data;
  };

  const verifyRegisterOtp = async ({ email, otp }) => {
    const response = await api.post("/auth/register/verify-otp", { email, otp });
    saveToken(response.data.accessToken);
    setUser(response.data.user);
    return response.data;
  };

  const login = async (payload) => {
    const response = await api.post("/auth/login", payload);
    saveToken(response.data.accessToken);
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Even if the server fails, clear local session so logout still works.
    } finally {
      saveToken(null);
      setUser(null);
    }
  };

  const forgotPassword = async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  };

  const resetPassword = async (token, newPassword) => {
    const response = await api.post("/auth/reset-password", { token, newPassword });
    return response.data;
  };

  const changePassword = async (currentPassword, newPassword) => {
    const response = await api.post("/auth/change-password", { currentPassword, newPassword });
    return response.data;
  };

  const updateProfile = async (payload) => {
    const response = await api.put("/auth/me", payload);
    setUser(response.data.user);
    return response.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        requestRegisterOtp,
        verifyRegisterOtp,
        login,
        logout,
        forgotPassword,
        resetPassword,
        changePassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
}
