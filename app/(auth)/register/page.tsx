import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { RegisterForm } from "./_components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream p-4">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-sage/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-amber/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber shadow-lg">
            <span className="text-2xl font-bold text-white">מ</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-800">ניהול משימות</h1>
          <p className="mt-1 text-sm text-stone-500">צור חשבון חדש בחינם</p>
        </div>

        <Card padding="lg" className="shadow-[0_8px_40px_0_rgba(212,163,115,0.20)]">
          <h2 className="mb-6 text-xl font-semibold text-stone-800">
            הרשמה למערכת
          </h2>

          <RegisterForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-stone-500">
              כבר יש לך חשבון?{" "}
              <Link
                href="/login"
                className="font-medium text-amber hover:text-amber/80 transition-colors"
              >
                התחבר כאן
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
