"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Users, LogOut, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/actions/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {!isLoginPage && (
            <aside className="w-64 flex-shrink-0">
              <div className="sticky top-8">
                <div className="flex flex-col gap-2">
                  <Link
                    href="/admin"
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-amber-50 text-amber-900",
                      pathname === "/admin" && "bg-amber-100"
                    )}
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
                  >
                    <Ticket className="w-5 h-5" />
                    <span>Generate Invites</span>
                  </Link>
                </div>

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
            </aside>
          )}

          <main className={cn("flex-1", isLoginPage && "w-full")}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
