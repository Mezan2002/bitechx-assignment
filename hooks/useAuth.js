import { logout as logoutAction, setCredentials } from "@/redux/auth/authSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const login = (email) => {
    const dummyToken = "dummy-token-for-design-preview";

    dispatch(setCredentials({ token: dummyToken, email }));

    try {
      localStorage.setItem("auth_token", dummyToken);
      localStorage.setItem("auth_email", email);
    } catch (error) {
      console.error("Failed to save token:", error);
    }

    toast.success("Login successful!");
    router.push("/products");
  };

  const logout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_email");
    localStorage.removeItem("redirect_after_login");
    router.push("/login");
  };

  return {
    login,
    logout,
    isLoading: false,
    error: null,
  };
};
