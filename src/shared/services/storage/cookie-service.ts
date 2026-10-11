import Cookies from "js-cookie";
import { encryptionService } from "../encryption/encryption-service";

type CookieKey = "accessToken" | "refreshToken";

const DEFAULT_OPTIONS: Cookies.CookieAttributes = {
  path: "/",
  sameSite: "Strict",
  secure: window.location.protocol === "https:",
};

export const cookieService = {
  setCookie(
    name: CookieKey,
    value: unknown,
    options?: Cookies.CookieAttributes
  ) {
    Cookies.set(name, encryptionService.encrypt(value), {
      ...DEFAULT_OPTIONS,
      ...options,
    });
  },

  getCookie<T = string>(name: CookieKey): T | null {
    const encrypted = Cookies.get(name);
    return encrypted ? encryptionService.decrypt<T>(encrypted) : null;
  },

  removeCookie(name: CookieKey) {
    Cookies.remove(name, { path: DEFAULT_OPTIONS.path });
  },
};
