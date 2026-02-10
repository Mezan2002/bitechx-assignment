"use client";

import Navbar from "@/shared-components/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
