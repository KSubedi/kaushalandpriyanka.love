import { prisma } from "../prisma";
import { Invite } from "@/utils/interfaces/InviteType";
import { v4 as uuidv4 } from "uuid";

export async function createInvite(
  inviteData: Omit<Invite, "id" | "created_at">
): Promise<Invite> {
  const id = uuidv4();

  const invite = await prisma.invite.create({
    data: {
      id,
      name: inviteData.name || null,
      email: inviteData.email || null,
      phone: inviteData.phone || null,
      additional_guests: inviteData.additional_guests || 0,
      events: inviteData.events,
      created_at: new Date(),
      updated_at: new Date(),
      is_template: inviteData.is_template || false,
      template_name: inviteData.template_name || null,
      location: inviteData.location || null,
      template_invite_id: inviteData.template_invite_id || null,
    },
  });

  return {
    id: invite.id,
    name: invite.name || "",
    email: invite.email || "",
    phone: invite.phone || "",
    additional_guests: invite.additional_guests,
    events: invite.events as Invite["events"],
    created_at: invite.created_at.toISOString(),
    is_template: invite.is_template,
    template_name: invite.template_name || "",
    location: invite.location as Invite["location"],
    template_invite_id: invite.template_invite_id || undefined,
  };
}

export async function getInviteById(id: string): Promise<Invite | null> {
  const invite = await prisma.invite.findUnique({
    where: { id },
    include: { response: true },
  });

  if (!invite) {
    return null;
  }

  return {
    id: invite.id,
    name: invite.name || "",
    email: invite.email || "",
    phone: invite.phone || "",
    additional_guests: invite.additional_guests,
    events: invite.events as Invite["events"],
    created_at: invite.created_at.toISOString(),
    is_template: invite.is_template,
    template_name: invite.template_name || "",
    location: invite.location as Invite["location"],
    template_invite_id: invite.template_invite_id || undefined,
    response: invite.response
      ? {
          id: invite.response.id,
          name: invite.response.name,
          email: invite.response.email,
          phone: invite.response.phone,
          inviteId: invite.response.invite_id,
          additional_guests: invite.response.additional_guests,
          events: invite.response.events as Invite["events"],
          created_at: invite.response.created_at.toISOString(),
          updated_at: invite.response.updated_at.toISOString(),
        }
      : undefined,
  };
}

export async function getAllInvites(): Promise<Invite[]> {
  console.log("getAllInvites: Starting database query");
  try {
    const invites = await prisma.invite.findMany({
      orderBy: { created_at: "desc" },
      include: { response: true },
    });

    console.log(`getAllInvites: Found ${invites.length} invites in database`);

    if (invites.length > 0) {
      console.log(
        "getAllInvites: Sample raw invite from DB:",
        JSON.stringify(invites[0], null, 2)
      );
    }

    const mappedInvites = invites.map((invite) => ({
      id: invite.id,
      name: invite.name || "",
      email: invite.email || "",
      phone: invite.phone || "",
      additional_guests: invite.additional_guests,
      events: invite.events as Invite["events"],
      created_at: invite.created_at.toISOString(),
      is_template: invite.is_template,
      template_name: invite.template_name || "",
      location: invite.location as Invite["location"],
      template_invite_id: invite.template_invite_id || undefined,
      response: invite.response
        ? {
            id: invite.response.id,
            name: invite.response.name,
            email: invite.response.email,
            phone: invite.response.phone,
            inviteId: invite.response.invite_id,
            additional_guests: invite.response.additional_guests,
            events: invite.response.events as Invite["events"],
            created_at: invite.response.created_at.toISOString(),
            updated_at: invite.response.updated_at.toISOString(),
          }
        : undefined,
    }));

    console.log(`getAllInvites: Mapped ${mappedInvites.length} invites`);

    if (mappedInvites.length > 0) {
      console.log(
        "getAllInvites: Sample mapped invite:",
        JSON.stringify(mappedInvites[0], null, 2)
      );
    }

    return mappedInvites;
  } catch (error) {
    console.error(
      "getAllInvites: Error fetching invites from database:",
      error
    );
    throw error;
  }
}

export async function updateInvite(
  id: string,
  inviteData: Partial<Invite>
): Promise<Invite> {
  const invite = await prisma.invite.update({
    where: { id },
    data: {
      name: inviteData.name !== undefined ? inviteData.name : undefined,
      email: inviteData.email !== undefined ? inviteData.email : undefined,
      phone: inviteData.phone !== undefined ? inviteData.phone : undefined,
      additional_guests:
        inviteData.additional_guests !== undefined
          ? inviteData.additional_guests
          : undefined,
      events: inviteData.events !== undefined ? inviteData.events : undefined,
      updated_at: new Date(),
      is_template:
        inviteData.is_template !== undefined
          ? inviteData.is_template
          : undefined,
      template_name:
        inviteData.template_name !== undefined
          ? inviteData.template_name
          : undefined,
      location:
        inviteData.location !== undefined ? inviteData.location : undefined,
      template_invite_id:
        inviteData.template_invite_id !== undefined
          ? inviteData.template_invite_id
          : undefined,
    },
    include: { response: true },
  });

  return {
    id: invite.id,
    name: invite.name || "",
    email: invite.email || "",
    phone: invite.phone || "",
    additional_guests: invite.additional_guests,
    events: invite.events as Invite["events"],
    created_at: invite.created_at.toISOString(),
    is_template: invite.is_template,
    template_name: invite.template_name || "",
    location: invite.location as Invite["location"],
    template_invite_id: invite.template_invite_id || undefined,
    response: invite.response
      ? {
          id: invite.response.id,
          name: invite.response.name,
          email: invite.response.email,
          phone: invite.response.phone,
          inviteId: invite.response.invite_id,
          additional_guests: invite.response.additional_guests,
          events: invite.response.events as Invite["events"],
          created_at: invite.response.created_at.toISOString(),
          updated_at: invite.response.updated_at.toISOString(),
        }
      : undefined,
  };
}

export async function deleteInvite(id: string): Promise<boolean> {
  try {
    await prisma.invite.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error("Error deleting invite:", error);
    return false;
  }
}
