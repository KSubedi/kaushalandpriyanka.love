// Using dynamic import for node-fetch
async function testApi() {
  try {
    console.log("Testing /api/admin/invites endpoint...");

    // Dynamically import node-fetch
    const { default: fetch } = await import("node-fetch");

    // Get the admin token from environment or hardcode for testing
    // This is just for testing - in production, never hardcode tokens
    const adminToken =
      process.env.ADMIN_TOKEN ||
      "admin_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImtzdWJlZGkiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDA0MzUyNTcsImV4cCI6MTc0MDUyMTY1N30.baRUdCFW2vdrNd5QMb8MhagXhVuXqskqKJ0WUa6PVGc";

    // Make the API request
    const response = await fetch("http://localhost:3001/api/admin/invites", {
      headers: {
        Cookie: `admin_token=${adminToken}`,
      },
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      console.error("API request failed with status:", response.status);
      return;
    }

    const data = await response.json();

    console.log("Response data structure:", Object.keys(data));
    console.log(`Received ${data.invites?.length || 0} invites from API`);

    if (data.invites && data.invites.length > 0) {
      console.log(
        "First invite from API:",
        JSON.stringify(data.invites[0], null, 2)
      );
    } else {
      console.log("No invites received from API");
    }
  } catch (error) {
    console.error("Error testing API:", error);
  }
}

testApi();
