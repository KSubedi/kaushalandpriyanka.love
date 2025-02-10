import { getInvite } from "@/app/actions/invite";
import ClientInviteWrapper from "@/components/ClientInviteWrapper";
import { Metadata } from "next";

// Force dynamic rendering and disable caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
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
      url: `/invite/${id}`,
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

export default async function InvitePage({ params }: PageProps) {
  const { id } = await params;
  const invite = await getInvite(id);

  // Add cache-busting query parameter to prevent caching
  const timestamp = Date.now();

  const baseUrl =
    process?.env?.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://kaushalandpriyanka.love";

  const canonicalUrl = `${baseUrl}/invite/${id}`;

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
      <link rel="canonical" href={canonicalUrl} />
      <ClientInviteWrapper invite={invite} id={id} />
    </>
  );
}
