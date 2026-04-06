import { AuthSession } from "../types/models";
import { apiRequest } from "./apiClient";

type LoginInput = {
  email: string;
  password: string;
};

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

export function login(input: LoginInput) {
  return apiRequest<AuthSession>("/auth/login", {
    method: "POST",
    body: input,
  });
}

export function refreshSession(refreshToken: string) {
  return apiRequest<RefreshResponse>("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
  });
}

export function logout(refreshToken: string) {
  return apiRequest<{ revoked: boolean }>("/auth/logout", {
    method: "POST",
    body: { refreshToken },
  });
}
