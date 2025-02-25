"use server";

import { NextResponse, NextRequest } from "next/server";
import { withAdminAuth } from "@/utils/auth-middleware";
import { getInviteById, updateInvite, deleteInvite } from "@/lib/db/invites";

type InviteParams = {
  id: string;
};

export const DELETE = withAdminAuth(
  async (request: NextRequest, { params }: { params: InviteParams }) => {
    try {
      const { id } = params;

      // Check if invite exists
      const existingInvite = await getInviteById(id);
      if (!existingInvite) {
        return NextResponse.json(
          { success: false, message: "Invite not found" },
          { status: 404 }
        );
      }

      // Delete the invite
      const success = await deleteInvite(id);

      if (!success) {
        return NextResponse.json(
          { success: false, message: "Failed to delete invite" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Invite deleted successfully",
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting invite:", error);

      return NextResponse.json(
        { success: false, message: "Failed to delete invite" },
        { status: 500 }
      );
    }
  }
);

export const PUT = withAdminAuth(
  async (request: NextRequest, { params }: { params: InviteParams }) => {
    try {
      const { id } = params;
      const data = await request.json();

      // Check if invite exists
      const existingInvite = await getInviteById(id);
      if (!existingInvite) {
        return NextResponse.json(
          { success: false, message: "Invite not found" },
          { status: 404 }
        );
      }

      // Process events based on location
      let updatedEvents = { ...existingInvite.events };

      if (data.events) {
        updatedEvents = { ...updatedEvents, ...data.events };
      }

      // If location is changing, update events accordingly
      if (data.location && data.location !== existingInvite.location) {
        if (data.location === "houston") {
          // For Houston location, disable Colorado Reception
          updatedEvents.coloradoReception = false;
        } else if (data.location === "colorado") {
          // For Colorado location, disable Houston events and enable Colorado Reception
          updatedEvents.haldi = false;
          updatedEvents.sangeet = false;
          updatedEvents.wedding = false;
          updatedEvents.reception = false;
          updatedEvents.coloradoReception = true;
        }
      }

      // Update the invite
      const updatedInvite = await updateInvite(id, {
        ...data,
        events: updatedEvents,
      });

      return NextResponse.json({
        success: true,
        message: "Invite updated successfully",
        invite: updatedInvite,
      });
    } catch (error) {
      console.error("Error updating invite:", error);
      return NextResponse.json(
        {
          success: false,
          message:
            error instanceof Error ? error.message : "Failed to update invite",
        },
        { status: 500 }
      );
    }
  }
);
