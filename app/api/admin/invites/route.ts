import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/utils/auth-middleware";
import { createInvite, getAllInvites } from "@/lib/db/invites";

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
    coloradoReception: boolean;
  };
  is_template?: boolean;
  location?: "houston" | "colorado";
  template_name?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GET = withAdminAuth(async (_request: NextRequest) => {
  console.log("GET /api/admin/invites - Starting to fetch invites");
  try {
    const invites = await getAllInvites();
    console.log(
      `GET /api/admin/invites - Successfully fetched ${invites.length} invites`
    );

    // Log the first invite for debugging
    if (invites.length > 0) {
      console.log("First invite sample:", JSON.stringify(invites[0], null, 2));
    } else {
      console.log("No invites found in the database");
    }

    return NextResponse.json({ success: true, invites });
  } catch (error) {
    console.error("Error fetching invites:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch invites" },
      { status: 500 }
    );
  }
});

export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const data: GenerateInviteRequest = await request.json();

    // Create the invite
    const invite = await createInvite({
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      additional_guests: data.additional_guests || 0,
      events: data.events,
      is_template: data.is_template || false,
      location: data.location,
      template_name: data.template_name || "",
    });

    return NextResponse.json({
      success: true,
      message: "Invite generated successfully",
      invite,
    });
  } catch (error) {
    console.error("Error generating invite:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate invite" },
      { status: 500 }
    );
  }
});
