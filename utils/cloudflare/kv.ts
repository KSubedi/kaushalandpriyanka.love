import { InviteResponse } from "@/app/actions/invite";
import { cfClient } from "@/utils/cloudflare/cloudflare";

export const getGuests = async () => {
  const guests = await cfClient.kv.namespaces.get("guests", {
    account_id: process.env["CLOUDFLARE_ACCOUNT_ID"]!,
  });

  return guests;
};

export const addGuestRSVP = async (guest: InviteResponse) => {
  await cfClient.kv.namespaces.create(
    {
      account_id: process.env["CLOUDFLARE_ACCOUNT_ID"]!,
      title: "Guests",
    },
    {
      body: {
        key: guest.id,
        value: JSON.stringify(guest),
      },
    }
  );
};
