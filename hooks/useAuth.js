import { authAPI } from "@/lib/api";
import { logout as logoutAction, setCredentials } from "@/redux/auth/authSlice";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: (email) => authAPI.login(email),
    onSuccess: (response, email) => {
      dispatch(setCredentials({ token: response.data.token, email }));
      router.push("/products");
    },
  });

  const logout = () => {
    dispatch(logoutAction());
    router.push("/login");
  };

  return {
    login: loginMutation.mutate,
    logout,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
};
