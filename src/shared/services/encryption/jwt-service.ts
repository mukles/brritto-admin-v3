import { jwtDecode, type JwtPayload } from "jwt-decode";
import { cookieService } from "../storage/cookie-service";

export type Session = JwtPayload;

export const decodeJwt = <T extends JwtPayload = Session>(
  token: string
): T | null => {
  try {
    return jwtDecode<T>(token);
  } catch (error) {
    console.error(
      "JWT Decoding Error:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const exp = decodeJwt(token)?.exp;
  return exp !== undefined && exp * 1000 <= Date.now();
};

export const getSession = (): Session | null => {
  const accessToken = cookieService.getCookie("accessToken");
  if (!accessToken) return null;
  return decodeJwt(accessToken);
};

export const isAuthenticated = (): boolean => {
  const accessToken = cookieService.getCookie("accessToken");
  return (
    !!accessToken && !!decodeJwt(accessToken) && !isTokenExpired(accessToken)
  );
};
