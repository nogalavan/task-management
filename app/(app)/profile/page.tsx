import { Camera, Mail, User, Phone } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/layout/PageHeader";

export default function ProfilePage() {
  return (
    <div>
      <PageHeader
        title="הפרופיל שלי"
        description="נהל את פרטי החשבון האישי שלך"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <div className="lg:col-span-1">
          <Card padding="lg" className="text-center">
            <div className="relative inline-block mb-4">
              <Avatar name="משתמש ראשי" size="xl" className="mx-auto" />
              <button
                className="absolute bottom-0 left-0 flex h-8 w-8 items-center justify-center rounded-full bg-amber text-white shadow-md hover:bg-amber/90 transition-colors"
                aria-label="שנה תמונת פרופיל"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <h2 className="text-lg font-bold text-stone-800">משתמש ראשי</h2>
            <p className="text-sm text-stone-500 mt-0.5">user@example.com</p>

            <div className="mt-4">
              <Badge variant="success">חבר פעיל</Badge>
            </div>

            <div className="mt-6 flex flex-col gap-2 text-sm text-stone-600">
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4 text-amber" />
                <span>user@example.com</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <User className="h-4 w-4 text-amber" />
                <span>חבר</span>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <Card padding="md" className="mt-4">
            <CardHeader>
              <CardTitle>סטטיסטיקות</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col gap-3">
                {[
                  { label: "משימות שהושלמו", value: "—" },
                  { label: "פרויקטים פעילים", value: "—" },
                  { label: "ימים ברציפות", value: "—" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between py-2 border-b border-amber/10 last:border-0"
                  >
                    <span className="text-sm text-stone-600">{stat.label}</span>
                    <span className="text-sm font-semibold text-stone-800">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Edit form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card padding="lg">
            <CardHeader>
              <CardTitle>פרטים אישיים</CardTitle>
            </CardHeader>
            <CardBody>
              <form className="flex flex-col gap-5" aria-label="עדכון פרטים אישיים">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Input
                    label="שם פרטי"
                    placeholder="ישראל"
                    defaultValue=""
                    rightIcon={<User className="h-4 w-4" />}
                  />
                  <Input
                    label="שם משפחה"
                    placeholder="ישראלי"
                    defaultValue=""
                  />
                </div>
                <Input
                  label="כתובת אימייל"
                  type="email"
                  placeholder="user@example.com"
                  defaultValue=""
                  rightIcon={<Mail className="h-4 w-4" />}
                />
                <Input
                  label="מספר טלפון"
                  type="tel"
                  placeholder="050-0000000"
                  defaultValue=""
                  rightIcon={<Phone className="h-4 w-4" />}
                />
                <div className="flex justify-start gap-3 pt-2">
                  <Button variant="primary">שמור שינויים</Button>
                  <Button variant="ghost">ביטול</Button>
                </div>
              </form>
            </CardBody>
          </Card>

          {/* Password change */}
          <Card padding="lg">
            <CardHeader>
              <CardTitle>שינוי סיסמה</CardTitle>
            </CardHeader>
            <CardBody>
              <form className="flex flex-col gap-5" aria-label="שינוי סיסמה">
                <Input
                  label="סיסמה נוכחית"
                  type="password"
                  placeholder="••••••••"
                />
                <Input
                  label="סיסמה חדשה"
                  type="password"
                  placeholder="••••••••"
                  hint="לפחות 8 תווים"
                />
                <Input
                  label="אימות סיסמה חדשה"
                  type="password"
                  placeholder="••••••••"
                />
                <div className="flex justify-start pt-2">
                  <Button variant="primary">עדכן סיסמה</Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
