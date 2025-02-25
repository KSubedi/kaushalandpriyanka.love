"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InvitesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin?tab=invites");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-500">
          Redirecting to the new admin dashboard...
        </p>
      </div>
    </div>
  );
}
