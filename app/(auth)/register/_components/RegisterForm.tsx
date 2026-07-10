"use client";

import { useActionState } from "react";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signup } from "@/app/actions/auth";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(signup, null);

  return (
    <form className="flex flex-col gap-5" aria-label="טופס הרשמה" action={formAction}>
      {/* Global error */}
      {state?.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      )}

      <Input
        name="full_name"
        label="שם מלא"
        type="text"
        placeholder="ישראל ישראלי"
        autoComplete="name"
        required
        rightIcon={<User className="h-4 w-4" />}
        error={state?.fieldErrors?.full_name}
      />

      <Input
        name="email"
        label="כתובת אימייל"
        type="email"
        placeholder="user@example.com"
        autoComplete="email"
        required
        rightIcon={<Mail className="h-4 w-4" />}
        error={state?.fieldErrors?.email}
      />

      <Input
        name="password"
        label="סיסמה"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        required
        hint="לפחות 6 תווים"
        rightIcon={<Lock className="h-4 w-4" />}
        error={state?.fieldErrors?.password}
      />

      <Button variant="primary" size="lg" fullWidth type="submit" disabled={isPending}>
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            נרשם...
          </span>
        ) : (
          "צור חשבון"
        )}
      </Button>
    </form>
  );
}
