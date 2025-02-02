function base64UrlDecode(str: string): string {
  // Convert Base64URL to Base64 by replacing URL-safe chars and adding padding
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const base64WithPadding = base64 + padding;

  // Decode Base64 to string using atob
  return atob(base64WithPadding);
}

export async function verifyAuth(token: string): Promise<boolean> {
  try {
    // Remove the admin_ prefix if it exists
    const actualToken = token.startsWith("admin_") ? token.slice(6) : token;

    // Split the token into parts
    const [headerB64, payloadB64, signature] = actualToken.split(".");
    if (!headerB64 || !payloadB64) return false;

    try {
      // Decode the payload
      const payloadStr = base64UrlDecode(payloadB64);
      const payload = JSON.parse(payloadStr);

      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        console.log("Token expired");
        return false;
      }

      // Check role
      if (payload.role !== "admin") {
        console.log("Not an admin token");
        return false;
      }

      return true;
    } catch (e) {
      console.error("Error decoding token:", e);
      return false;
    }
  } catch (error) {
    console.error("Auth verification error:", error);
    return false;
  }
}
