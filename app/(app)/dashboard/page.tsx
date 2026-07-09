import {
  FolderKanban,
  CheckSquare,
  Clock,
  ListTodo,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";

const stats = [
  {
    label: "פרויקטים פעילים",
    value: "—",
    icon: FolderKanban,
    color: "text-amber",
    bg: "bg-amber/10",
  },
  {
    label: "משימות שהושלמו",
    value: "—",
    icon: CheckSquare,
    color: "text-green-600",
    bg: "bg-sage/30",
  },
  {
    label: "בתהליך",
    value: "—",
    icon: Clock,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    label: "לביצוע",
    value: "—",
    icon: ListTodo,
    color: "text-stone-500",
    bg: "bg-stone-100",
  },
];

const recentActivity = [
  { user: "ישראל ישראלי", action: "יצר משימה חדשה", time: "לפני דקה", project: "עיצוב מוצר" },
  { user: "שרה כהן", action: "השלים משימה", time: "לפני 10 דקות", project: "פיתוח Backend" },
  { user: "דוד לוי", action: "עדכן סטטוס", time: "לפני שעה", project: "שיווק Q3" },
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="לוח ראשי"
        description="סקירה כללית של כל הפרויקטים והמשימות שלך"
        actions={
          <Button variant="primary" size="md">
            <FolderKanban className="h-4 w-4" />
            פרויקט חדש
          </Button>
        }
      />

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} padding="md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-stone-500 font-medium mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-stone-800">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}
                >
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-stone-400">
                <TrendingUp className="h-3 w-3" />
                <span>יתעדכן בקרוב</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent projects placeholder */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <CardHeader className="px-5 pt-5">
              <CardTitle>פרויקטים אחרונים</CardTitle>
              <Badge variant="default">פעילים</Badge>
            </CardHeader>
            <CardBody>
              {/* Placeholder rows */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-5 py-4 border-t border-amber/10 first:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-amber/15 flex items-center justify-center">
                      <FolderKanban className="h-4 w-4 text-amber" />
                    </div>
                    <div>
                      <div className="h-4 w-32 rounded bg-sage-light animate-pulse" />
                      <div className="mt-1 h-3 w-20 rounded bg-sage-light/70 animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-16 rounded-full bg-sage-light animate-pulse" />
                    <Avatar name="משתמש" size="xs" />
                  </div>
                </div>
              ))}
              <div className="px-5 py-4 border-t border-amber/10">
                <Button variant="ghost" size="sm" fullWidth>
                  הצג את כל הפרויקטים
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Activity feed */}
        <div>
          <Card padding="none">
            <CardHeader className="px-5 pt-5">
              <CardTitle>פעילות אחרונה</CardTitle>
              <Users className="h-4 w-4 text-stone-400" />
            </CardHeader>
            <CardBody>
              <ul className="flex flex-col">
                {recentActivity.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-3 px-5 py-4 border-t border-amber/10 first:border-0"
                  >
                    <Avatar name={item.user} size="xs" className="mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-stone-700">
                        <span className="font-medium">{item.user}</span>{" "}
                        {item.action}
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {item.project} · {item.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
