"use server";

import { NextResponse, NextRequest } from "next/server";
import { withAdminAuth } from "@/utils/auth-middleware";
import {
  getResponseById,
  updateResponse,
  deleteResponse,
} from "@/lib/db/responses";

type ResponseParams = {
  id: string;
};

export const DELETE = withAdminAuth(
  async (request: NextRequest, { params }: { params: ResponseParams }) => {
    try {
      const { id } = params;

      // Check if response exists
      const existingResponse = await getResponseById(id);
      if (!existingResponse) {
        return NextResponse.json(
          { success: false, message: "Response not found" },
          { status: 404 }
        );
      }

      // Delete the response
      const success = await deleteResponse(id);

      if (!success) {
        return NextResponse.json(
          { success: false, message: "Failed to delete response" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Response deleted successfully",
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting response:", error);

      return NextResponse.json(
        { success: false, message: "Failed to delete response" },
        { status: 500 }
      );
    }
  }
);

export const PUT = withAdminAuth(
  async (request: NextRequest, { params }: { params: ResponseParams }) => {
    try {
      const { id } = params;
      const data = await request.json();

      // Check if response exists
      const existingResponse = await getResponseById(id);
      if (!existingResponse) {
        return NextResponse.json(
          { success: false, message: "Response not found" },
          { status: 404 }
        );
      }

      // Update the response
      const updatedResponse = await updateResponse(id, data);

      return NextResponse.json({
        success: true,
        message: "Response updated successfully",
        response: updatedResponse,
      });
    } catch (error) {
      console.error("Error updating response:", error);
      return NextResponse.json(
        {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to update response",
        },
        { status: 500 }
      );
    }
  }
);
