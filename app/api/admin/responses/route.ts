"use server";

import { CloudflareKV } from "@/lib/cloudflare/kv";
import { InviteResponse } from "@/utils/interfaces/InviteType";
import { NextResponse } from "next/server";
import { withAdminAuth } from "@/utils/auth-middleware";

interface KVKey {
  name: string;
  expiration?: number;
  metadata?: unknown;
}

export async function GET() {
  return withAdminAuth(async () => {
    try {
      // Get all keys that start with 'response:'
      const keys = await CloudflareKV.list<KVKey>({ prefix: "response:" });

      if (!keys?.length) {
        console.log("No responses found");
        return NextResponse.json({ responses: [] });
      }

      console.log(`Found ${keys.length} responses`);

      // Fetch all responses in parallel
      const responses = await Promise.all(
        keys.map(async (key: KVKey) => {
          try {
            const response = await CloudflareKV.get<InviteResponse>(key.name);
            return response;
          } catch (error) {
            console.error(`Error fetching response ${key.name}:`, error);
            return null;
          }
        })
      );

      // Filter out any null values and sort by creation date
      const validResponses = responses
        .filter(
          (response: InviteResponse | null): response is InviteResponse =>
            response !== null
        )
        .sort(
          (a: InviteResponse, b: InviteResponse) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

      console.log(`Returning ${validResponses.length} valid responses`);
      return NextResponse.json({ responses: validResponses });
    } catch (error) {
      console.error("Error fetching responses:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch responses",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  });
}
