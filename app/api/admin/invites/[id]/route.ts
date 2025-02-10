"use server";

import { CloudflareKV } from "@/lib/cloudflare/kv";
import { Invite } from "@/utils/interfaces/InviteType";
import { NextResponse, NextRequest } from "next/server";
import { withAdminAuth } from "@/utils/auth-middleware";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAdminAuth(async () => {
    try {
      const { id } = await params;
      const key = `invite:${id}`;

      const existingInvite = await CloudflareKV.get(key);
      if (existingInvite === null) {
        return NextResponse.json(
          { error: "Invite not found" },
          { status: 404 }
        );
      }

      await CloudflareKV.delete(key);

      return NextResponse.json(
        {
          ok: true,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting invite:", error);

      return NextResponse.json(
        { error: "Failed to delete invite" },
        { status: 500 }
      );
    }
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAdminAuth(async () => {
    try {
      const { id } = await params;
      const key = `invite:${id}`;
      const data = await request.json();

      // Get the existing invite
      const existingInvite = await CloudflareKV.get<Invite>(key);
      if (existingInvite === null) {
        return NextResponse.json(
          { error: "Invite not found" },
          { status: 404 }
        );
      }

      // Update the invite with new data
      const updatedInvite: Invite = {
        ...existingInvite,
        ...data,
        events: {
          ...existingInvite.events,
          ...data.events,
        },
      };

      // Store the updated invite
      await CloudflareKV.put(key, updatedInvite);

      return NextResponse.json({ invite: updatedInvite });
    } catch (error) {
      console.error("Error updating invite:", error);
      return NextResponse.json(
        { error: "Failed to update invite" },
        { status: 500 }
      );
    }
  });
}
