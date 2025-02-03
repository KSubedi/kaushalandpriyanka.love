"use server";

import { CloudflareKV } from "@/lib/cloudflare/kv";
import { Invite, InviteResponse } from "@/utils/interfaces/InviteType";

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
  };
  is_template?: boolean;
}

export async function getInvite(id: string): Promise<Invite | null> {
  return CloudflareKV.get<Invite>(`invite:${id}`);
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

    // Get the template invite
    const templateInvite = await getInvite(inviteId);
    if (!templateInvite) {
      return {
        success: false,
        message: "Invalid invitation ID.",
      };
    }

    // Validate selected events against invite events
    const invalidEvents = Object.entries(events).filter(
      ([event, selected]) =>
        selected && !templateInvite.events[event as keyof typeof events]
    );

    if (invalidEvents.length > 0) {
      return {
        success: false,
        message: `You are not invited to the following events: ${invalidEvents
          .map(([event]) => event)
          .join(", ")}`,
      };
    }

    // Generate a new unique invite ID for this response
    const responseInviteId = crypto.randomUUID();

    // Create a new invite for this response
    const newInvite: Invite = {
      id: responseInviteId,
      name,
      email,
      phone: phoneDigits,
      events: templateInvite.events,
      created_at: new Date().toISOString(),
      template_invite_id: inviteId,
      is_template: false,
    };

    // Create the response
    const response: InviteResponse = {
      id: crypto.randomUUID(),
      name,
      email,
      phone: phoneDigits,
      inviteId: responseInviteId, // Use the new invite ID
      additional_guests,
      events,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add the response to the new invite
    newInvite.response = response;

    // Store the new invite
    await CloudflareKV.put(`invite:${responseInviteId}`, newInvite);

    // Store the response separately for querying
    await CloudflareKV.put(`response:${response.id}`, response);

    // Update template invite stats
    const updatedTemplateInvite: Invite = {
      ...templateInvite,
      responses: [...(templateInvite.responses || []), responseInviteId],
      is_template: true,
    };
    await CloudflareKV.put(`invite:${inviteId}`, updatedTemplateInvite);

    return {
      success: true,
      message:
        "Thank you for your response! We look forward to celebrating with you.",
      data: response,
    };
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
  // Generate a unique ID
  const inviteId = crypto.randomUUID();

  // Create the invite
  const invite: Invite = {
    id: inviteId,
    events: data.events,
    ...(data.name && { name: data.name }),
    ...(data.email && { email: data.email }),
    ...(data.phone && { phone: data.phone }),
    created_at: new Date().toISOString(),
    is_template: data.is_template || false,
    responses: data.is_template ? [] : undefined,
  };

  // Store in KV
  await CloudflareKV.put(`invite:${inviteId}`, invite);

  return inviteId;
}
