"use client";

import Loading from "@/shared-components/Loading";
import Navbar from "@/shared-components/Navbar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function DashboardLayout({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Check both Redux state and localStorage
    const checkAuth = () => {
      if (typeof window === "undefined") {
        setIsChecking(false);
        return;
      }

      const token = localStorage.getItem("auth_token");

      if (!token && !isAuthenticated) {
        // Save redirect path for after login
        localStorage.setItem("redirect_after_login", pathname);
        router.push("/login");
        setIsChecking(false);
        return;
      }

      setHasToken(!!token);
      setIsChecking(false);
    };

    // Small delay to allow Redux to rehydrate
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, router, pathname]);

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  // Block rendering if no auth
  if (!isAuthenticated && !hasToken) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
