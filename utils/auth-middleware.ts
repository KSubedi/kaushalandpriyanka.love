import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAuth } from "./auth";

export async function withAdminAuth<T>(
  handler: () => Promise<T>
): Promise<T | NextResponse> {
  try {
    // Verify admin authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token");
    if (!token || !(await verifyAuth(token.value))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Call the handler if authentication is successful
    return await handler();
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
