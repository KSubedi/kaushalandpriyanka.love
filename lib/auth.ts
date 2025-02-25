import { NextRequest } from "next/server";

export async function verifyAdminAuth(request: NextRequest): Promise<boolean> {
  try {
    // Get the admin token from cookies
    const adminToken = request.cookies.get("admin_token")?.value;

    if (!adminToken) {
      return false;
    }

    // Compare with the environment variable
    const validToken = process.env.ADMIN_TOKEN;

    if (!validToken) {
      console.error("ADMIN_TOKEN environment variable is not set");
      return false;
    }

    return adminToken === validToken;
  } catch (error) {
    console.error("Error verifying admin auth:", error);
    return false;
  }
}
