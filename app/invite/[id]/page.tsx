import { getInvite } from "@/app/actions/invite";
import { InviteContent } from "@/components/InviteContent";

export default async function InvitePage({
  params,
}: {
  params: { id: string };
}) {
  const invite = await getInvite(params.id);
  return <InviteContent invite={invite} id={params.id} />;
}
