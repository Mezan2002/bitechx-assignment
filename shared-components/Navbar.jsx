"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function Navbar() {
  const { logout } = useAuth();
  const { email } = useSelector((state) => state.auth);

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/products" className="text-2xl font-bold">
            Product Manager
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary">{email}</span>
            <Button
              onClick={logout}
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
