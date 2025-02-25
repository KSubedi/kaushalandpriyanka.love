import { NextRequest, NextResponse } from "next/server";
import { migrateInvitesFromKV } from "@/lib/migration";
import { withAdminAuth } from "@/utils/auth-middleware";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const POST = withAdminAuth(async (_request: NextRequest) => {
  try {
    // Trigger the migration
    const result = await migrateInvitesFromKV();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Migration API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: `Migration failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
});
