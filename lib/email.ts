import { Resend } from "resend";
import { InviteResponse } from "@/utils/interfaces/InviteType";
import { WEDDING_EVENTS } from "@/app/config/constants";

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Event address mapping
const EVENT_ADDRESSES: Record<string, string> = {
  haldi: "123 Haldi Venue, Houston, TX 77001",
  sangeet: "456 Sangeet Venue, Houston, TX 77002",
  wedding: "789 Wedding Venue, Houston, TX 77003",
  reception: "789 Reception Venue, Houston, TX 77003", // Same venue as wedding
  coloradoReception: "101 Colorado Reception Venue, Denver, CO 80001",
};

// Event time mapping
const EVENT_TIMES: Record<string, string> = {
  haldi: "10:00 AM - 12:00 PM",
  sangeet: "6:00 PM - 10:00 PM",
  wedding: "11:00 AM - 2:00 PM",
  reception: "6:00 PM - 11:00 PM",
  coloradoReception: "6:00 PM - 11:00 PM",
};

// Event color mapping
const EVENT_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  haldi: { bg: "#FFF9C4", text: "#7E6000", border: "#FFC107" },
  sangeet: { bg: "#F8BBD0", text: "#880E4F", border: "#E91E63" },
  wedding: { bg: "#BBDEFB", text: "#0D47A1", border: "#2196F3" },
  reception: { bg: "#C8E6C9", text: "#1B5E20", border: "#4CAF50" },
  coloradoReception: { bg: "#D1C4E9", text: "#4527A0", border: "#673AB7" },
};

// Map event keys to their uppercase counterparts for WEDDING_EVENTS lookup
const EVENT_KEY_MAP: Record<string, keyof typeof WEDDING_EVENTS> = {
  haldi: "HALDI",
  sangeet: "SANGEET",
  wedding: "WEDDING",
  reception: "RECEPTION",
  coloradoReception: "COLORADO_RECEPTION",
};

interface SendRsvpConfirmationEmailParams {
  response: InviteResponse;
}

/**
 * Sends an RSVP confirmation email to the guest
 */
export async function sendRsvpConfirmationEmail({
  response,
}: SendRsvpConfirmationEmailParams) {
  if (!response.email) {
    throw new Error("Email is required to send confirmation");
  }

  // Get the events the guest is attending
  const attendingEvents = Object.entries(response.events)
    .filter(([, isAttending]) => isAttending)
    .map(([eventKey]) => eventKey);

  if (attendingEvents.length === 0) {
    throw new Error("No events selected for attendance");
  }

  // Generate the event details section
  const eventDetailsHtml = attendingEvents
    .map((eventKey) => {
      const weddingEventKey = EVENT_KEY_MAP[eventKey] || "WEDDING";
      const eventName = WEDDING_EVENTS[weddingEventKey]?.NAME || eventKey;
      const eventDate = WEDDING_EVENTS[weddingEventKey]?.ENGLISH_DATE || "";
      const eventAddress = EVENT_ADDRESSES[eventKey] || "";
      const eventTime = EVENT_TIMES[eventKey] || "";
      const eventColor = EVENT_COLORS[eventKey] || {
        bg: "#f9f9f9",
        text: "#333",
        border: "#e1e1e1",
      };

      return `
      <div style="margin-bottom: 20px; padding: 20px; border: 2px solid ${eventColor.border}; border-radius: 8px; background-color: ${eventColor.bg};">
        <h3 style="margin-top: 0; color: ${eventColor.text}; font-size: 18px;">${eventName}</h3>
        <div style="display: flex; margin: 10px 0;">
          <div style="width: 24px; margin-right: 10px;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${eventColor.text}" width="24" height="24">
              <path d="M19,4H17V3a1,1,0,0,0-2,0V4H9V3A1,1,0,0,0,7,3V4H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm1,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V12H20Zm0-9H4V7A1,1,0,0,1,5,6H7V7A1,1,0,0,0,9,7V6h6V7a1,1,0,0,0,2,0V6h2a1,1,0,0,1,1,1Z"/>
            </svg>
          </div>
          <p style="margin: 0; color: ${eventColor.text};"><strong>Date:</strong> ${eventDate}</p>
        </div>
        <div style="display: flex; margin: 10px 0;">
          <div style="width: 24px; margin-right: 10px;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${eventColor.text}" width="24" height="24">
              <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20ZM16,9H13V6a1,1,0,0,0-2,0V9H8a1,1,0,0,0,0,2h3v3a1,1,0,0,0,2,0V11h3a1,1,0,0,0,0-2Z"/>
            </svg>
          </div>
          <p style="margin: 0; color: ${eventColor.text};"><strong>Time:</strong> ${eventTime}</p>
        </div>
        <div style="display: flex; margin: 10px 0;">
          <div style="width: 24px; margin-right: 10px;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${eventColor.text}" width="24" height="24">
              <path d="M12,2a8,8,0,0,0-8,8c0,5.4,7.05,11.5,7.35,11.76a1,1,0,0,0,1.3,0C13,21.5,20,15.4,20,10A8,8,0,0,0,12,2Zm0,17.65c-2.13-2-6-6.31-6-9.65a6,6,0,0,1,12,0C18,13.34,14.13,17.66,12,19.65ZM12,6a4,4,0,1,0,4,4A4,4,0,0,0,12,6Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,12Z"/>
            </svg>
          </div>
          <p style="margin: 0; color: ${eventColor.text};"><strong>Location:</strong> ${eventAddress}</p>
        </div>
      </div>
    `;
    })
    .join("");

  // Create the edit RSVP link
  const editRsvpLink = `${
    process.env.NEXT_PUBLIC_BASE_URL || "https://kaushalandpriyanka.love"
  }/invite/${response.inviteId}`;

  // Create the email HTML
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>RSVP Confirmation - Kaushal & Priyanka's Wedding</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f5f5f5">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow: hidden; max-width: 90%;">
              <!-- Header with gradient background -->
              <tr>
                <td align="center" style="background: linear-gradient(135deg, #4a6fa5 0%, #e91e63 100%); padding: 40px 20px;">
                  <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">RSVP Confirmation</h1>
                  <p style="color: white; margin: 10px 0 0; font-size: 16px;">Thank you for your RSVP to Kaushal & Priyanka's Wedding!</p>
                </td>
              </tr>
              
              <!-- Main content -->
              <tr>
                <td style="padding: 30px;">
                  <p style="font-size: 16px; line-height: 1.5; color: #333; margin-top: 0;">Dear <strong>${
                    response.name
                  }</strong>,</p>
                  <p style="font-size: 16px; line-height: 1.5; color: #333;">We're delighted that you'll be joining us for our special day! Below are the details of the events you'll be attending:</p>
                  
                  <!-- Event details -->
                  <div style="margin: 30px 0;">
                    ${eventDetailsHtml}
                  </div>
                  
                  <!-- Guest count -->
                  <div style="background-color: #f0f7ff; border-radius: 8px; padding: 15px; margin: 20px 0; border-left: 4px solid #4a6fa5;">
                    <p style="margin: 0; font-size: 16px; color: #333;">
                      <strong>Number of Guests:</strong> ${
                        1 + (response.additional_guests || 0)
                      }
                    </p>
                  </div>
                  
                  <!-- Edit RSVP button -->
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${editRsvpLink}" style="display: inline-block; background-color: #4a6fa5; color: white; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-weight: bold; font-size: 16px;">
                      ${
                        response.updated_at !== response.created_at
                          ? "Update Your RSVP"
                          : "Edit Your RSVP"
                      }
                    </a>
                  </div>
                  
                  <p style="font-size: 16px; line-height: 1.5; color: #333;">If you have any questions, please don't hesitate to reach out to us.</p>
                  <p style="font-size: 16px; line-height: 1.5; color: #333;">We look forward to celebrating with you!</p>
                  <p style="font-size: 16px; line-height: 1.5; color: #333; margin-bottom: 0;">Warm regards,<br>Kaushal & Priyanka Subedi</p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #e1e1e1;">
                  <p style="margin: 0; color: #666; font-size: 14px;">
                    For any questions, please contact us at:
                    <a href="mailto:hello@kaushalandpriyanka.love" style="color: #4a6fa5; text-decoration: none;">hello@kaushalandpriyanka.love</a>
                  </p>
                  <p style="margin: 10px 0 0; color: #666; font-size: 14px;">
                    <a href="https://kaushalandpriyanka.love" style="color: #4a6fa5; text-decoration: none;">kaushalandpriyanka.love</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: "Kaushal & Priyanka <wedding@kaushalandpriyanka.love>",
      to: [response.email],
      subject: "Your RSVP Confirmation - Kaushal & Priyanka's Wedding",
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
