import type { Metadata } from "next";
import { Mail, User, CheckSquare, FolderKanban, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { UpdateNameForm } from "@/components/profile/UpdateNameForm";
import { UpdatePasswordForm } from "@/components/profile/UpdatePasswordForm";
import { DeleteAccountButton } from "@/components/profile/DeleteAccountButton";
import { getCurrentUser } from "@/lib/supabase/auth";
import { getCurrentProfile } from "@/lib/profiles";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "הפרופיל שלי | ניהול משימות" };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profileResult = await getCurrentProfile();
  const profile = profileResult.data;

  const fullName = profile?.full_name ?? (user.user_metadata?.full_name as string) ?? "משתמש";
  const email = user.email ?? "";

  // Fetch quick stats
  const supabase = await createClient();
  const [{ count: doneCount }, { count: projectCount }] = await Promise.all([
    supabase.from("tasks").select("id", { count: "exact", head: true }).eq("assigned_user", user.id).eq("status", "done"),
    supabase.from("projects").select("id", { count: "exact", head: true }),
  ]);

  return (
    <div>
      <PageHeader
        title="הפרופיל שלי"
        description="נהל את פרטי החשבון האישי שלך"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Left sidebar: avatar + stats ── */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <Card padding="lg" className="text-center">
            <div className="relative inline-block mb-4">
              <Avatar name={fullName} size="xl" className="mx-auto" />
            </div>

            <h2 className="text-lg font-bold text-stone-800">{fullName}</h2>
            <p className="text-sm text-stone-500 mt-0.5">{email}</p>

            <div className="mt-4">
              <Badge variant="success">חבר פעיל</Badge>
            </div>

            <div className="mt-5 flex flex-col gap-2 text-sm text-stone-500">
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4 text-amber flex-shrink-0" />
                <span className="truncate">{email}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <User className="h-4 w-4 text-amber flex-shrink-0" />
                <span>{fullName}</span>
              </div>
            </div>
          </Card>

          {/* Quick stats */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>סטטיסטיקות</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col gap-0">
                <div className="flex items-center justify-between py-3 border-b border-amber/10">
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <CheckSquare className="h-4 w-4 text-green-500" />
                    <span>משימות שהושלמו</span>
                  </div>
                  <span className="text-sm font-bold text-stone-800">{doneCount ?? 0}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <FolderKanban className="h-4 w-4 text-amber" />
                    <span>פרויקטים זמינים</span>
                  </div>
                  <span className="text-sm font-bold text-stone-800">{projectCount ?? 0}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ── Main area: forms ── */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card padding="lg">
            <CardHeader>
              <CardTitle>פרטים אישיים</CardTitle>
            </CardHeader>
            <CardBody>
              <UpdateNameForm currentName={fullName} />
            </CardBody>
          </Card>

          <Card padding="lg">
            <CardHeader>
              <CardTitle>שינוי סיסמה</CardTitle>
            </CardHeader>
            <CardBody>
              <UpdatePasswordForm />
            </CardBody>
          </Card>

          {/* Danger zone */}
          <Card padding="lg" className="border border-red-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-500" />
                <CardTitle className="text-red-600">אזור מסוכן</CardTitle>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-700">מחיקת חשבון</p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    פעולה זו בלתי הפיכה. כל הנתונים יימחקו לצמיתות.
                  </p>
                </div>
                <DeleteAccountButton />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
