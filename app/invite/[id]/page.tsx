import { getInvite } from "@/app/actions/invite";
import ClientInviteWrapper from "@/components/ClientInviteWrapper";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invite = await getInvite(id);
  return <ClientInviteWrapper invite={invite} id={id} />;
}
