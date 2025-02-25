"use server";

import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/utils/auth-middleware";
import { getAllResponses } from "@/lib/db/responses";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GET = withAdminAuth(async (_request: NextRequest) => {
  try {
    const responses = await getAllResponses();

    return NextResponse.json({ success: true, responses });
  } catch (error) {
    console.error("Error fetching responses:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch responses" },
      { status: 500 }
    );
  }
});
