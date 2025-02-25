import { prisma } from "../prisma";
import { InviteResponse } from "@/utils/interfaces/InviteType";
import { v4 as uuidv4 } from "uuid";

export async function createResponse(
  responseData: Omit<InviteResponse, "id" | "created_at" | "updated_at">
): Promise<InviteResponse> {
  const id = uuidv4();

  const response = await prisma.response.create({
    data: {
      id,
      name: responseData.name,
      email: responseData.email,
      phone: responseData.phone,
      additional_guests: responseData.additional_guests,
      events: responseData.events,
      created_at: new Date(),
      updated_at: new Date(),
      invite_id: responseData.inviteId,
    },
  });

  return {
    id: response.id,
    name: response.name,
    email: response.email,
    phone: response.phone,
    additional_guests: response.additional_guests,
    events: response.events as InviteResponse["events"],
    created_at: response.created_at.toISOString(),
    updated_at: response.updated_at.toISOString(),
    inviteId: response.invite_id,
  };
}

export async function getResponseById(
  id: string
): Promise<InviteResponse | null> {
  const response = await prisma.response.findUnique({
    where: { id },
  });

  if (!response) {
    return null;
  }

  return {
    id: response.id,
    name: response.name,
    email: response.email,
    phone: response.phone,
    additional_guests: response.additional_guests,
    events: response.events as InviteResponse["events"],
    created_at: response.created_at.toISOString(),
    updated_at: response.updated_at.toISOString(),
    inviteId: response.invite_id,
  };
}

export async function getResponseByInviteId(
  inviteId: string
): Promise<InviteResponse | null> {
  const response = await prisma.response.findFirst({
    where: { invite_id: inviteId },
  });

  if (!response) {
    return null;
  }

  return {
    id: response.id,
    name: response.name,
    email: response.email,
    phone: response.phone,
    additional_guests: response.additional_guests,
    events: response.events as InviteResponse["events"],
    created_at: response.created_at.toISOString(),
    updated_at: response.updated_at.toISOString(),
    inviteId: response.invite_id,
  };
}

export async function getAllResponses(): Promise<InviteResponse[]> {
  const responses = await prisma.response.findMany({
    orderBy: { created_at: "desc" },
  });

  return responses.map((response) => ({
    id: response.id,
    name: response.name,
    email: response.email,
    phone: response.phone,
    additional_guests: response.additional_guests,
    events: response.events as InviteResponse["events"],
    created_at: response.created_at.toISOString(),
    updated_at: response.updated_at.toISOString(),
    inviteId: response.invite_id,
  }));
}

export async function updateResponse(
  id: string,
  responseData: Partial<InviteResponse>
): Promise<InviteResponse> {
  const response = await prisma.response.update({
    where: { id },
    data: {
      name: responseData.name !== undefined ? responseData.name : undefined,
      email: responseData.email !== undefined ? responseData.email : undefined,
      phone: responseData.phone !== undefined ? responseData.phone : undefined,
      additional_guests:
        responseData.additional_guests !== undefined
          ? responseData.additional_guests
          : undefined,
      events:
        responseData.events !== undefined ? responseData.events : undefined,
      updated_at: new Date(),
      invite_id:
        responseData.inviteId !== undefined ? responseData.inviteId : undefined,
    },
  });

  return {
    id: response.id,
    name: response.name,
    email: response.email,
    phone: response.phone,
    additional_guests: response.additional_guests,
    events: response.events as InviteResponse["events"],
    created_at: response.created_at.toISOString(),
    updated_at: response.updated_at.toISOString(),
    inviteId: response.invite_id,
  };
}

export async function deleteResponse(id: string): Promise<boolean> {
  try {
    await prisma.response.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error("Error deleting response:", error);
    return false;
  }
}
