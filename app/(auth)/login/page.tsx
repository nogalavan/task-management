import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
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
            מערכת ניהול פרויקטים ומשימות
          </p>
        </div>

        <Card padding="lg" className="shadow-[0_8px_40px_0_rgba(212,163,115,0.20)]">
          <h2 className="mb-6 text-xl font-semibold text-stone-800">
            התחברות לחשבון
          </h2>

          <form className="flex flex-col gap-5" aria-label="טופס התחברות">
            <Input
              label="כתובת אימייל"
              type="email"
              placeholder="user@example.com"
              autoComplete="email"
              required
              rightIcon={<Mail className="h-4 w-4" />}
            />

            <div>
              <Input
                label="סיסמה"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
                rightIcon={<Lock className="h-4 w-4" />}
              />
              <div className="mt-1.5 flex justify-start">
                <Link
                  href="/forgot-password"
                  className="text-xs text-amber hover:text-amber/80 transition-colors"
                >
                  שכחת סיסמה?
                </Link>
              </div>
            </div>

            <Button variant="primary" size="lg" fullWidth type="submit">
              התחבר
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-stone-500">
              אין לך חשבון עדיין?{" "}
              <Link
                href="/register"
                className="font-medium text-amber hover:text-amber/80 transition-colors"
              >
                הירשם עכשיו
              </Link>
            </p>
          </div>
        </Card>

        <p className="mt-6 text-center text-xs text-stone-400">
          בהתחברות אתה מסכים ל
          <Link href="/terms" className="text-amber hover:underline mx-1">
            תנאי השימוש
          </Link>
          ול
          <Link href="/privacy" className="text-amber hover:underline mx-1">
            מדיניות הפרטיות
          </Link>
        </p>
      </div>
    </div>
  );
}
