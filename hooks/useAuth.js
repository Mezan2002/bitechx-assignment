import { authAPI } from "@/lib/api";
import { logout as logoutAction, setCredentials } from "@/redux/auth/authSlice";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: (email) => authAPI.login(email),
    onSuccess: (response, email) => {
      const token = response.data.token;

      if (!token) {
        toast.error("No token received from server");
        return;
      }

      // Save to Redux
      dispatch(setCredentials({ token, email }));

      // Save to localStorage IMMEDIATELY
      try {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_email", email);
      } catch (error) {
        console.error("Failed to save token:", error);
        toast.error("Failed to save authentication");
        return;
      }

      toast.success("Login successful!");

      // Check for redirect path
      const redirectPath = localStorage.getItem("redirect_after_login");
      if (redirectPath) {
        localStorage.removeItem("redirect_after_login");
        router.push(redirectPath);
      } else {
        router.push("/products");
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    },
  });

  const logout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_email");
    localStorage.removeItem("redirect_after_login");
    router.push("/login");
  };

  return {
    login: loginMutation.mutate,
    logout,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
};
