import { AppShell } from "@/components/layout/AppShell";
import { getCurrentUser, getUserDisplayName } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const userName = getUserDisplayName(user);

  return <AppShell userName={userName}>{children}</AppShell>;
}
