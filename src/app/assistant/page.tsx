import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PlantChat from "@/components/PlantChat";

export const metadata: Metadata = {
  title: "Plant AI Assistant | Sonbula",
  description: "Chat with the plant disease detection AI assistant",
};

export default function AssistantPage() {
  return (
    <>
      <Navbar />
      <PlantChat />
    </>
  );
}
