import { useMutation } from "@/shared/hooks/use-mutation";
import { login } from "../services/session";

export function useLogin() {
  return useMutation(login, { errorToast: false });
}
