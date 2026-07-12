"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { updatePasswordAction } from "@/app/actions/profile";

export function UpdatePasswordForm() {
  const [current, setCurrent]   = useState("");
  const [next, setNext]         = useState("");
  const [confirm, setConfirm]   = useState("");
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    setSuccess(false);

    const result = await updatePasswordAction(current, next, confirm);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setCurrent(""); setNext(""); setConfirm("");
    }

    setIsPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div role="status" className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          הסיסמה עודכנה בהצלחה
        </div>
      )}

      <Input
        label="סיסמה נוכחית"
        type="password"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        placeholder="••••••••"
        required
      />
      <Input
        label="סיסמה חדשה"
        type="password"
        value={next}
        onChange={(e) => setNext(e.target.value)}
        placeholder="••••••••"
        hint="לפחות 8 תווים"
        required
      />
      <Input
        label="אימות סיסמה חדשה"
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="••••••••"
        required
      />

      <div className="flex justify-start pt-1">
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? "מעדכן..." : "עדכן סיסמה"}
        </Button>
      </div>
    </form>
  );
}
