"use client";

import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "@/app/actions/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50">
      {!isLoginPage && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-lg text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      <div className="w-full">
        <main className="flex-1 w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
