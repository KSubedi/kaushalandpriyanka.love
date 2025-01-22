import MainContent from "@/components/MainContent";

export default function Page() {
  if (typeof window !== "undefined") {
    return <MainContent />;
  } else {
    return null;
  }
}
