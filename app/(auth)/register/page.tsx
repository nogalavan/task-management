import Link from "next/link";
import { Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

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
          <p className="mt-1 text-sm text-stone-500">
            צור חשבון חדש בחינם
          </p>
        </div>

        <Card padding="lg" className="shadow-[0_8px_40px_0_rgba(212,163,115,0.20)]">
          <h2 className="mb-6 text-xl font-semibold text-stone-800">
            יצירת חשבון חדש
          </h2>

          <form className="flex flex-col gap-5" aria-label="טופס הרשמה">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="שם פרטי"
                type="text"
                placeholder="ישראל"
                autoComplete="given-name"
                required
                rightIcon={<User className="h-4 w-4" />}
              />
              <Input
                label="שם משפחה"
                type="text"
                placeholder="ישראלי"
                autoComplete="family-name"
                required
              />
            </div>

            <Input
              label="כתובת אימייל"
              type="email"
              placeholder="user@example.com"
              autoComplete="email"
              required
              rightIcon={<Mail className="h-4 w-4" />}
            />

            <Input
              label="סיסמה"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              required
              hint="לפחות 8 תווים"
              rightIcon={<Lock className="h-4 w-4" />}
            />

            <Input
              label="אימות סיסמה"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              required
              rightIcon={<Lock className="h-4 w-4" />}
            />

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                className="mt-0.5 h-4 w-4 rounded border-amber/40 accent-amber"
              />
              <span className="text-sm text-stone-600">
                אני מסכים/ה ל
                <Link href="/terms" className="text-amber hover:underline mx-1">
                  תנאי השימוש
                </Link>
                ול
                <Link href="/privacy" className="text-amber hover:underline mx-1">
                  מדיניות הפרטיות
                </Link>
              </span>
            </label>

            <Button variant="primary" size="lg" fullWidth type="submit">
              צור חשבון
            </Button>
          </form>

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
