"use client";

import { Invite } from "@/utils/interfaces/InviteType";
import dynamic from "next/dynamic";

interface InviteContentProps {
  invite: Invite | null;
  id: string;
}

// Import InviteContent dynamically with no SSR
const InviteContent = dynamic<InviteContentProps>(
  () => import("@/components/InviteContent"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-amber-800">Loading invitation...</p>
      </div>
    ),
  }
);

export default function ClientInviteWrapper({
  invite,
  id,
}: InviteContentProps) {
  return <InviteContent invite={invite} id={id} />;
}
