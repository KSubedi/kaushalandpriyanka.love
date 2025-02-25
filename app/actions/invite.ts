"use server";

import { prisma } from "@/lib/prisma";
import { Invite, InviteResponse } from "@/utils/interfaces/InviteType";
import { Prisma } from "@prisma/client";

interface InviteFormData {
  name: string;
  email: string;
  phone: string;
  inviteId: string;
  additional_guests: number;
  events: {
    haldi: boolean;
    sangeet: boolean;
    wedding: boolean;
    reception: boolean;
    coloradoReception: boolean;
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: InviteResponse;
}

interface GenerateInviteData {
  name?: string;
  email?: string;
  phone?: string;
  events: {
    haldi: boolean;
    sangeet: boolean;
    wedding: boolean;
    reception: boolean;
    coloradoReception: boolean;
  };
  is_template?: boolean;
}

type EventsObject = {
  haldi: boolean;
  sangeet: boolean;
  wedding: boolean;
  reception: boolean;
  coloradoReception: boolean;
};

export async function getInvite(id: string): Promise<Invite | null> {
  try {
    console.log(`Attempting to fetch invite with ID: ${id}`);

    if (!id) {
      console.error("Invalid invite ID: ID is empty or undefined");
      return null;
    }

    const invite = await prisma.invite.findUnique({
      where: { id },
      include: { response: true },
    });

    if (!invite) {
      console.error(`Invite not found with ID: ${id}`);
      return null;
    }

    console.log(`Successfully found invite: ${invite.id}`);

    // Convert Prisma model to Invite interface
    return {
      id: invite.id,
      name: invite.name || undefined,
      email: invite.email || undefined,
      phone: invite.phone || undefined,
      events: invite.events as EventsObject,
      created_at: invite.created_at.toISOString(),
      is_template: invite.is_template,
      template_name: invite.template_name || undefined,
      location:
        (invite.location as "houston" | "colorado" | undefined) || undefined,
      template_invite_id: invite.template_invite_id || undefined,
      response: invite.response
        ? {
            id: invite.response.id,
            name: invite.response.name,
            email: invite.response.email,
            phone: invite.response.phone,
            inviteId: invite.response.invite_id,
            additional_guests: invite.response.additional_guests,
            events: invite.response.events as EventsObject,
            created_at: invite.response.created_at.toISOString(),
            updated_at: invite.response.updated_at.toISOString(),
          }
        : undefined,
    };
  } catch (error) {
    console.error("Error fetching invite:", error);
    return null;
  }
}

export async function submitInviteResponse({
  name,
  email,
  phone,
  inviteId,
  additional_guests,
  events,
}: InviteFormData): Promise<ApiResponse> {
  try {
    // Validate the data
    if (!name || !email || !phone || !inviteId) {
      return {
        success: false,
        message: "All fields are required",
      };
    }

    // Additional guests validation
    if (additional_guests < 0 || additional_guests > 5) {
      return {
        success: false,
        message: "Additional guests must be between 0 and 5",
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Please enter a valid email address",
      };
    }

    // Phone validation - allow different formats but must be at least 10 digits
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      return {
        success: false,
        message: "Please enter a valid phone number",
      };
    }

    // Get the invite
    const invite = await prisma.invite.findUnique({
      where: { id: inviteId },
      include: { response: true },
    });

    if (!invite) {
      return {
        success: false,
        message: "Invalid invitation ID.",
      };
    }

    // Validate selected events against invite events
    const inviteEvents = invite.events as EventsObject;
    const invalidEvents = Object.entries(events).filter(
      ([event, selected]) =>
        selected && !inviteEvents[event as keyof typeof events]
    );

    if (invalidEvents.length > 0) {
      return {
        success: false,
        message: `You are not invited to the following events: ${invalidEvents
          .map(([event]) => event)
          .join(", ")}`,
      };
    }

    // Check if this is a template invite or a regular invite
    if (invite.is_template) {
      // For template invites, create a new invite and response
      // Generate a new unique invite ID for this response
      const responseInviteId = crypto.randomUUID();

      // Create a new invite and response in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create a new invite for this response
        const newInvite = await tx.invite.create({
          data: {
            id: responseInviteId,
            name,
            email,
            phone: phoneDigits,
            events: invite.events as Prisma.InputJsonValue,
            is_template: false,
            template_invite_id: inviteId,
          },
        });

        // Create the response linked to the new invite
        const response = await tx.response.create({
          data: {
            id: crypto.randomUUID(),
            name,
            email,
            phone: phoneDigits,
            invite_id: responseInviteId,
            additional_guests,
            events: events as Prisma.InputJsonValue,
          },
        });

        return { newInvite, response };
      });

      return {
        success: true,
        message:
          "Thank you for your response! We look forward to celebrating with you.",
        data: {
          id: result.response.id,
          name: result.response.name,
          email: result.response.email,
          phone: result.response.phone,
          inviteId: result.response.invite_id,
          additional_guests: result.response.additional_guests,
          events: result.response.events as EventsObject,
          created_at: result.response.created_at.toISOString(),
          updated_at: result.response.updated_at.toISOString(),
        },
      };
    } else {
      // For regular invites, update the invite and create/update the response
      let response;

      if (invite.response) {
        // Update existing response
        response = await prisma.response.update({
          where: { id: invite.response.id },
          data: {
            name,
            email,
            phone: phoneDigits,
            additional_guests,
            events: events as Prisma.InputJsonValue,
            updated_at: new Date(),
          },
        });
      } else {
        // Create new response for this invite
        response = await prisma.response.create({
          data: {
            id: crypto.randomUUID(),
            name,
            email,
            phone: phoneDigits,
            invite_id: inviteId,
            additional_guests,
            events: events as Prisma.InputJsonValue,
          },
        });
      }

      // Update the invite with the user's info
      await prisma.invite.update({
        where: { id: inviteId },
        data: {
          name,
          email,
          phone: phoneDigits,
          updated_at: new Date(),
        },
      });

      return {
        success: true,
        message:
          "Thank you for your response! We look forward to celebrating with you.",
        data: {
          id: response.id,
          name: response.name,
          email: response.email,
          phone: response.phone,
          inviteId: response.invite_id,
          additional_guests: response.additional_guests,
          events: response.events as EventsObject,
          created_at: response.created_at.toISOString(),
          updated_at: response.updated_at.toISOString(),
        },
      };
    }
  } catch (error) {
    console.error("Error processing invite response:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function generateInviteId(
  data: GenerateInviteData
): Promise<string> {
  try {
    // Create the invite using Prisma
    const invite = await prisma.invite.create({
      data: {
        events: data.events as Prisma.InputJsonValue,
        name: data.name || null,
        email: data.email || null,
        phone: data.phone || null,
        is_template: data.is_template || false,
      },
    });

    return invite.id;
  } catch (error) {
    console.error("Error generating invite:", error);
    throw new Error("Failed to generate invite");
  }
}
