/* Create the DELETE endpoint for deleting an invite */

"use server";

import { CloudflareKV } from "@/lib/cloudflare/kv";
import { NextResponse } from "next/server";
import { withAdminAuth } from "@/utils/auth-middleware";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAdminAuth(async () => {
    try {
      const { id } = params;
      const key = `invite:${id}`;
      await CloudflareKV.delete(key);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting invite:", error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Unknown error" },
        { status: 500 }
      );
    }
  });
}
