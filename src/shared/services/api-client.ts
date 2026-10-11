import { redirect } from "@tanstack/react-router";
import axios from "axios";
import { ENV } from "../constant";
import { cookieService } from "./storage";
import type { ApiClient, RefreshTokenResponse } from "../types";

const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = cookieService.getCookie("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const refreshToken = async (): Promise<string | null> => {
  try {
    const currentRefreshToken = cookieService.getCookie("refreshToken");
    if (!currentRefreshToken) {
      return null;
    }

    const { data: refreshResponse } = await axios.post<RefreshTokenResponse>(
      ENV.API_BASE_URL + "/auth/refresh-token",
      {
        refreshToken: currentRefreshToken,
      },
    );

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      refreshResponse;

    if (!newAccessToken || !newRefreshToken) {
      throw new Error("Invalid token response format");
    }

    cookieService.setCookie("accessToken", newAccessToken);
    cookieService.setCookie("refreshToken", newRefreshToken);

    return newAccessToken;
  } catch (error) {
    cookieService.removeCookie("accessToken");
    cookieService.removeCookie("refreshToken");

    return null;
  }
};

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      const newToken = await refreshToken();
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return apiClient.request(error.config);
      } else {
        if (window.location.pathname === "/login") {
          return Promise.reject(error);
        }
        cookieService.removeCookie("accessToken");
        cookieService.removeCookie("refreshToken");
        redirect({ to: "/login" });
        window.location.reload();
      }
    } else if (error.code === "ERR_NETWORK") {
      return Promise.reject({
        ...error,
        message:
          "No internet connection. Please check your network and try again.",
      });
    }

    return Promise.reject(error);
  },
);

export default apiClient as ApiClient;
