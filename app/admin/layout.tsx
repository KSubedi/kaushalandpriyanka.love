"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Users, LogOut, Ticket, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/actions/auth";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const SidebarContent = () => (
    <div className="flex flex-col gap-2">
      <Link
        href="/admin"
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-amber-50 text-amber-900",
          pathname === "/admin" && "bg-amber-100"
        )}
        onClick={() => setIsSidebarOpen(false)}
      >
        <Users className="w-5 h-5" />
        <span>Responses</span>
      </Link>

      <Link
        href="/admin/invites"
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-amber-50 text-amber-900",
          pathname === "/admin/invites" && "bg-amber-100"
        )}
        onClick={() => setIsSidebarOpen(false)}
      >
        <Ticket className="w-5 h-5" />
        <span>Generate Invites</span>
      </Link>

      <div className="mt-8">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 text-red-600 w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white">
      {!isLoginPage && (
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-white shadow-lg text-amber-900 hover:bg-amber-50"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      )}

      <div className="w-full">
        <div className="flex gap-8">
          {!isLoginPage && (
            <>
              {/* Desktop Sidebar */}
              <aside className="hidden lg:block w-64 flex-shrink-0 pl-8">
                <div className="sticky top-8">
                  <SidebarContent />
                </div>
              </aside>

              {/* Mobile Sidebar */}
              {isSidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                  <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                    onClick={toggleSidebar}
                  />
                  <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl p-4">
                    <SidebarContent />
                  </div>
                </div>
              )}
            </>
          )}

          <main
            className={cn(
              "flex-1 w-full min-h-screen py-8",
              !isLoginPage && "lg:pr-8"
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
