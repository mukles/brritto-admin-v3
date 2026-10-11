import { encryptionService } from "../encryption/encryption-service";

type StorageKey = "user";

export const localStorageService = {
  setItem(key: StorageKey, value: unknown) {
    try {
      localStorage.setItem(key, encryptionService.encrypt(value));
    } catch {}
  },

  getItem<T>(key: StorageKey): T | null {
    try {
      const encrypted = localStorage.getItem(key);
      return encrypted ? encryptionService.decrypt<T>(encrypted) : null;
    } catch {
      return null;
    }
  },

  removeItem(key: StorageKey) {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};
