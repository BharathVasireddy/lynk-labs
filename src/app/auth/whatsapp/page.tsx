import { redirect } from "next/navigation";

export default function WhatsAppAuthRedirect() {
  redirect("/auth/login");
} 