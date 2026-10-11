import CryptoJS from "crypto-js";
import { env } from "@/shared/config/env";

export const encryptionService = {
  encrypt(data: unknown): string {
    const stringData: string = JSON.stringify(data);
    return CryptoJS.AES.encrypt(
      stringData,
      env.VITE_STORAGE_SECRET_KEY
    ).toString();
  },

  decrypt<T = unknown>(cipherText: string): T | null {
    try {
      const bytes = CryptoJS.AES.decrypt(
        cipherText,
        env.VITE_STORAGE_SECRET_KEY
      );
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) as T;
    } catch (error) {
      console.error("Decryption failed:", error);
      return null;
    }
  },
};
