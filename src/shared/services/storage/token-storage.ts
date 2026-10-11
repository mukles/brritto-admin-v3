import { cookieService } from "./cookie-service";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

const REFRESH_TOKEN_TTL_DAYS = 7;

export const tokenStorage = {
  getAccessToken: () => cookieService.getCookie("accessToken"),
  getRefreshToken: () => cookieService.getCookie("refreshToken"),

  setTokens({ accessToken, refreshToken }: AuthTokens) {
    cookieService.setCookie("accessToken", accessToken);
    cookieService.setCookie("refreshToken", refreshToken, {
      expires: REFRESH_TOKEN_TTL_DAYS,
    });
  },

  clearTokens() {
    cookieService.removeCookie("accessToken");
    cookieService.removeCookie("refreshToken");
  },
};
