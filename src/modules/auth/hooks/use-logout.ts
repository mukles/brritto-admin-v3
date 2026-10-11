import { useMutation } from "@/shared/hooks/use-mutation";
import { logout } from "../services/session";

export function useLogout() {
  return useMutation(logout);
}
