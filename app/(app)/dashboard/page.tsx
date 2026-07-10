import Link from "next/link";
import {
  FolderKanban,
  CheckSquare,
  Clock,
  ListTodo,
  Calendar,
  Activity,
  BarChart2,
  Plus,
  Trophy,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { TaskStatusChart } from "@/components/dashboard/TaskStatusChart";
import { TasksPerProjectChart } from "@/components/dashboard/TasksPerProjectChart";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TopPerformers } from "@/components/dashboard/TopPerformers";
import { getDashboardStats } from "@/lib/dashboard";

export default async function DashboardPage() {
  const { data: stats, error } = await getDashboardStats();

  if (error || !stats) {
    return (
      <div>
        <PageHeader title="לוח ראשי" description="סקירה כללית של הפרויקטים והמשימות" />
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          שגיאה בטעינת הנתונים: {error}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label:     "פרויקטים",
      value:     stats.projectsCount,
      icon:      FolderKanban,
      iconColor: "text-amber",
      iconBg:    "bg-amber/10",
      caption:   "כלל הפרויקטים",
    },
    {
      label:     "משימות",
      value:     stats.tasksCount,
      icon:      ListTodo,
      iconColor: "text-stone-500",
      iconBg:    "bg-stone-100",
      caption:   "סה״כ",
    },
    {
      label:     "הושלמו",
      value:     stats.doneCount,
      icon:      CheckSquare,
      iconColor: "text-green-600",
      iconBg:    "bg-green-50",
      caption:   stats.tasksCount > 0
        ? `${Math.round((stats.doneCount / stats.tasksCount) * 100)}% מהמשימות`
        : undefined,
    },
    {
      label:     "בתהליך",
      value:     stats.inProgressCount,
      icon:      Clock,
      iconColor: "text-amber-600",
      iconBg:    "bg-amber/10",
      caption:   `${stats.todoCount} ממתינות`,
    },
  ];

  return (
    <div>
      <PageHeader
        title="לוח ראשי"
        description="סקירה כללית של כל הפרויקטים והמשימות"
        actions={
          <Link href="/projects">
            <Button variant="primary" size="md">
              <Plus className="h-4 w-4" />
              פרויקט חדש
            </Button>
          </Link>
        }
      />

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Main content grid ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* LEFT/CENTER column — charts */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Status donut chart */}
          <Card padding="none">
            <CardHeader className="px-5 pt-5">
              <CardTitle>
                <span className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-amber" />
                  משימות לפי סטטוס
                </span>
              </CardTitle>
            </CardHeader>
            <CardBody className="px-5 pb-5">
              <TaskStatusChart data={stats.statusBreakdown} />
            </CardBody>
          </Card>

          {/* Tasks per project bar chart */}
          {stats.tasksByProject.length > 0 && (
            <Card padding="none">
              <CardHeader className="px-5 pt-5">
                <CardTitle>
                  <span className="flex items-center gap-2">
                    <FolderKanban className="h-4 w-4 text-amber" />
                    משימות לפי פרויקט
                  </span>
                </CardTitle>
              </CardHeader>
              <CardBody className="px-5 pb-5">
                <TasksPerProjectChart data={stats.tasksByProject} />
              </CardBody>
            </Card>
          )}

          {/* Upcoming tasks */}
          <Card padding="none">
            <CardHeader className="px-5 pt-5">
              <CardTitle>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber" />
                  משימות קרובות
                </span>
              </CardTitle>
              <Link href="/tasks">
                <Button variant="ghost" size="sm" className="text-xs">
                  הצג הכל
                </Button>
              </Link>
            </CardHeader>
            <CardBody>
              <UpcomingTasks tasks={stats.upcomingTasks} />
            </CardBody>
          </Card>
        </div>

        {/* RIGHT column — recent activity + top performers */}
        <div className="flex flex-col gap-6">
          <Card padding="none">
            <CardHeader className="px-5 pt-5">
              <CardTitle>
                <span className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-amber" />
                  פעילות אחרונה
                </span>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <RecentActivity entries={stats.recentActivity} />
            </CardBody>
            <div className="px-5 pb-4 pt-2 border-t border-amber/10">
              <Link href="/tasks">
                <Button variant="ghost" size="sm" fullWidth>
                  כל המשימות
                </Button>
              </Link>
            </div>
          </Card>

          {/* Top performers */}
          <Card padding="none">
            <CardHeader className="px-5 pt-5">
              <CardTitle>
                <span className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber" />
                  משימות שהושלמו לפי משתמש
                </span>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <TopPerformers
                performers={stats.topPerformers}
                totalDone={stats.doneCount}
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
