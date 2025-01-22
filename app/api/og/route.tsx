import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            position: "relative",
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle at 25px 25px, #fef2f2 2%, transparent 0%), radial-gradient(circle at 75px 75px, #fffbeb 2%, transparent 0%)",
              backgroundSize: "100px 100px",
              opacity: 0.3,
            }}
          />

          {/* Gradient Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom right, rgba(220, 38, 38, 0.1), rgba(245, 158, 11, 0.1))",
            }}
          />

          {/* Content Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "40px",
              position: "relative",
              gap: "20px",
            }}
          >
            {/* Heart Icon */}
            <div
              style={{
                fontSize: "80px",
                marginBottom: "20px",
              }}
            >
              ❤️
            </div>

            {/* Names */}
            <div
              style={{
                fontSize: "72px",
                fontWeight: "bold",
                background: "linear-gradient(to right, #dc2626, #f59e0b)",
                backgroundClip: "text",
                color: "transparent",
                marginBottom: "20px",
              }}
            >
              Kaushal & Priyanka
            </div>

            {/* Date and Location */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  fontSize: "36px",
                  color: "#78350f",
                  fontWeight: 500,
                }}
              >
                March 6th, 2025
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "#b45309",
                }}
              >
                Houston, TX
              </div>
            </div>

            {/* Decorative Line */}
            <div
              style={{
                width: "200px",
                height: "2px",
                background:
                  "linear-gradient(to right, transparent, #dc2626, #f59e0b, transparent)",
                margin: "20px 0",
              }}
            />

            {/* Tagline */}
            <div
              style={{
                fontSize: "32px",
                color: "#57534e",
                fontStyle: "italic",
              }}
            >
              Beginning our forever
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
