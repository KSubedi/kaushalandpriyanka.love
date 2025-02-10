import { getInvite } from "@/app/actions/invite";
import ClientInviteWrapper from "@/components/ClientInviteWrapper";
import { Metadata } from "next";

// Force dynamic rendering and disable caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Disable caching at the edge
export const fetchCache = "force-no-store";
export const runtime = "edge";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const baseUrl =
    process?.env?.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://kaushalandpriyanka.love";

  const title = "Wedding Invitation | Kaushal & Priyanka's Wedding";
  const description = "Join us as we begin our journey together as the Subedis";

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description,
      url: `/invite/${params.id}`,
      siteName: "Kaushal & Priyanka's Wedding",
      images: [
        {
          url: "/api/og",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/api/og"],
    },
  };
}

export default async function InvitePage({ params }: Props) {
  const invite = await getInvite(params.id);

  // Add cache-busting query parameter to prevent caching
  const timestamp = Date.now();

  return (
    <>
      {/* Add cache-busting meta tags */}
      <meta
        httpEquiv="Cache-Control"
        content="no-cache, no-store, must-revalidate"
      />
      <meta httpEquiv="Pragma" content="no-cache" />
      <meta httpEquiv="Expires" content="0" />
      <meta name="timestamp" content={timestamp.toString()} />
      <ClientInviteWrapper invite={invite} id={params.id} />
    </>
  );
}
