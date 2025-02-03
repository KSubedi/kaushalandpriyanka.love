import { getInvite } from "@/app/actions/invite";
import { InviteContent } from "@/components/InviteContent";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invite = await getInvite(id);
  return <InviteContent invite={invite} id={id} />;
}
