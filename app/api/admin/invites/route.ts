import { CloudflareKV } from "@/lib/cloudflare/kv";
import { Invite } from "@/utils/interfaces/InviteType";
import { NextResponse } from "next/server";
import { withAdminAuth } from "@/utils/auth-middleware";

interface KVKey {
  name: string;
  expiration?: number;
  metadata?: unknown;
}

interface GenerateInviteRequest {
  name?: string;
  email?: string;
  phone?: string;
  additional_guests?: number;
  events: {
    haldi: boolean;
    sangeet: boolean;
    wedding: boolean;
    reception: boolean;
  };
}

export async function GET() {
  return withAdminAuth(async () => {
    try {
      // Get all keys that start with 'invite:'
      const keys = await CloudflareKV.list<KVKey>({ prefix: "invite:" });

      if (!keys?.length) {
        console.log("No invites found");
        return NextResponse.json({ invites: [] });
      }

      console.log(`Found ${keys.length} invites`);

      // Fetch all invites in parallel
      const invites = await Promise.all(
        keys.map(async (key: KVKey) => {
          try {
            const invite = await CloudflareKV.get<Invite>(key.name);
            return invite;
          } catch (error) {
            console.error(`Error fetching invite ${key.name}:`, error);
            return null;
          }
        })
      );

      // Filter out any null values and sort by creation date
      const validInvites = invites
        .filter((invite: Invite | null): invite is Invite => invite !== null)
        .sort(
          (a: Invite, b: Invite) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

      console.log(`Returning ${validInvites.length} valid invites`);
      return NextResponse.json({ invites: validInvites });
    } catch (error) {
      console.error("Error fetching invites:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch invites",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: Request) {
  return withAdminAuth(async () => {
    try {
      console.log("Received POST request to generate invite");
      const data = (await request.json()) as GenerateInviteRequest;
      console.log("Request data:", data);

      // Validate that at least one event is selected
      const hasEvent = Object.values(data.events).some(
        (isSelected) => isSelected
      );
      if (!hasEvent) {
        console.log("No events selected");
        return NextResponse.json(
          { error: "At least one event must be selected" },
          { status: 400 }
        );
      }

      // Create the invite
      const invite: Invite = {
        id: crypto.randomUUID(),
        events: data.events,
        created_at: new Date().toISOString(),
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.phone && { phone: data.phone }),
      };

      console.log("Created invite object:", invite);

      // Store in KV
      try {
        await CloudflareKV.put(`invite:${invite.id}`, invite);
        console.log("Successfully stored invite in KV");
      } catch (kvError) {
        console.error("Error storing invite in KV:", kvError);
        throw new Error("Failed to store invite in database");
      }

      return NextResponse.json({ invite });
    } catch (error) {
      console.error("Error generating invite:", error);
      return NextResponse.json(
        {
          error: "Failed to generate invite",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  });
}
