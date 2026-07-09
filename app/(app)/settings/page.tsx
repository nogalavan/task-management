import { Bell, Shield, Globe, Palette, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/layout/PageHeader";

function SettingRow({
  label,
  description,
  action,
}: {
  label: string;
  description?: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-amber/10 last:border-0">
      <div>
        <p className="text-sm font-medium text-stone-700">{label}</p>
        {description && (
          <p className="text-xs text-stone-400 mt-0.5">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer" aria-label="הפעל/כבה">
      <input
        type="checkbox"
        className="sr-only peer"
        defaultChecked={defaultChecked}
      />
      <div className="w-10 h-5 bg-stone-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber/40 rounded-full peer peer-checked:after:translate-x-5 rtl:peer-checked:after:-translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:right-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber" />
    </label>
  );
}

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="הגדרות"
        description="נהל את העדפות המערכת שלך"
      />

      <div className="flex flex-col gap-6 max-w-2xl">
        {/* Notifications */}
        <Card padding="lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber" />
              <CardTitle>התראות</CardTitle>
            </div>
          </CardHeader>
          <CardBody>
            <SettingRow
              label="התראות אימייל"
              description="קבל עדכונים על משימות חדשות לדוא״ל"
              action={<Toggle defaultChecked />}
            />
            <SettingRow
              label="התראות דחיפה"
              description="קבל התראות בדפדפן"
              action={<Toggle />}
            />
            <SettingRow
              label="תזכורות תאריכי יעד"
              description="קבל תזכורת 24 שעות לפני מועד יעד"
              action={<Toggle defaultChecked />}
            />
            <SettingRow
              label="עדכוני פרויקטים"
              description="קבל עדכונים כשחברי צוות עורכים פרויקטים"
              action={<Toggle />}
            />
          </CardBody>
        </Card>

        {/* Appearance */}
        <Card padding="lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-amber" />
              <CardTitle>מראה</CardTitle>
            </div>
          </CardHeader>
          <CardBody>
            <SettingRow
              label="שפת הממשק"
              description="שפת תצוגה של המערכת"
              action={
                <span className="text-sm font-medium text-stone-700 bg-sage-light px-3 py-1 rounded-lg">
                  עברית
                </span>
              }
            />
            <SettingRow
              label="כיוון הטקסט"
              description="כיוון קריאה וכתיבה"
              action={
                <span className="text-sm font-medium text-stone-700 bg-sage-light px-3 py-1 rounded-lg">
                  ימין לשמאל
                </span>
              }
            />
          </CardBody>
        </Card>

        {/* Language & Region */}
        <Card padding="lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-amber" />
              <CardTitle>אזור ושפה</CardTitle>
            </div>
          </CardHeader>
          <CardBody>
            <SettingRow
              label="אזור זמן"
              description="Jerusalem (UTC+3)"
              action={<Button variant="outline" size="sm">שנה</Button>}
            />
            <SettingRow
              label="פורמט תאריך"
              description="DD/MM/YYYY"
              action={<Button variant="outline" size="sm">שנה</Button>}
            />
          </CardBody>
        </Card>

        {/* Security */}
        <Card padding="lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber" />
              <CardTitle>אבטחה</CardTitle>
            </div>
          </CardHeader>
          <CardBody>
            <SettingRow
              label="אימות דו-שלבי"
              description="הגן על חשבונך עם שכבת אבטחה נוספת"
              action={<Toggle />}
            />
            <SettingRow
              label="התנתקות מכל המכשירים"
              description="סיים את כל הפגישות הפעילות"
              action={<Button variant="outline" size="sm">התנתק מהכל</Button>}
            />
          </CardBody>
        </Card>

        {/* Danger zone */}
        <Card padding="lg" className="border-red-200 border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              <CardTitle className="text-red-600">אזור מסוכן</CardTitle>
            </div>
          </CardHeader>
          <CardBody>
            <SettingRow
              label="מחיקת חשבון"
              description="פעולה זו בלתי הפיכה. כל הנתונים יימחקו לצמיתות."
              action={
                <Button variant="danger" size="sm">
                  מחק חשבון
                </Button>
              }
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
