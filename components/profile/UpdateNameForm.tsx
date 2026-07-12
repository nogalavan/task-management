"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { updateNameAction } from "@/app/actions/profile";

interface UpdateNameFormProps {
  currentName: string;
}

export function UpdateNameForm({ currentName }: UpdateNameFormProps) {
  const [name, setName]       = useState(currentName);
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    setSuccess(false);

    const result = await updateNameAction(name);
    if (result.error) setError(result.error);
    else setSuccess(true);

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
          השם עודכן בהצלחה
        </div>
      )}

      <Input
        label="שם מלא"
        value={name}
        onChange={(e) => { setName(e.target.value); setSuccess(false); }}
        placeholder="הכנס שם מלא"
        required
        rightIcon={<User className="h-4 w-4" />}
      />

      <div className="flex justify-start gap-3 pt-1">
        <Button type="submit" variant="primary" disabled={isPending || name === currentName}>
          {isPending ? "שומר..." : "שמור שינויים"}
        </Button>
      </div>
    </form>
  );
}
