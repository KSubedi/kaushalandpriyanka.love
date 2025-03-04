import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendWelcomeEmail } from "@/lib/email";
import { withAdminAuth } from "@/utils/auth-middleware";
import { InviteResponse } from "@/utils/interfaces/InviteType";

const prisma = new PrismaClient();

export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    // Parse request body
    const body = await request.json();
    const { responseId } = body;

    if (!responseId) {
      return NextResponse.json(
        { error: "Response ID is required" },
        { status: 400 }
      );
    }

    // Fetch the response with the invite
    const response = await prisma.response.findUnique({
      where: { id: responseId },
      include: { invite: true },
    });

    if (!response) {
      return NextResponse.json(
        { error: "Response not found" },
        { status: 404 }
      );
    }

    // Check if welcome email has already been sent
    if (response.welcome_email_sent) {
      return NextResponse.json(
        { error: "Welcome email has already been sent to this recipient" },
        { status: 400 }
      );
    }

    // Format the response for the email function
    const formattedResponse: InviteResponse = {
      id: response.id,
      name: response.name,
      email: response.email,
      phone: response.phone,
      inviteId: response.invite_id,
      additional_guests: response.additional_guests,
      events: {
        haldi: Boolean((response.events as Record<string, boolean>)?.haldi),
        sangeet: Boolean((response.events as Record<string, boolean>)?.sangeet),
        wedding: Boolean((response.events as Record<string, boolean>)?.wedding),
        reception: Boolean(
          (response.events as Record<string, boolean>)?.reception
        ),
        coloradoReception: Boolean(
          (response.events as Record<string, boolean>)?.coloradoReception
        ),
      },
      created_at: response.created_at.toISOString(),
      updated_at: response.updated_at.toISOString(),
      welcome_email_sent: response.welcome_email_sent,
    };

    // Send the welcome email
    await sendWelcomeEmail({
      response: formattedResponse,
    });

    // Update the response to mark welcome email as sent
    await prisma.response.update({
      where: { id: responseId },
      data: { welcome_email_sent: true },
    });

    return NextResponse.json({
      success: true,
      message: "Welcome email sent successfully",
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return NextResponse.json(
      {
        error: "Failed to send welcome email",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
});
