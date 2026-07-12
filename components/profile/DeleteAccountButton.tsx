"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function DeleteAccountButton() {
  const [confirmed, setConfirmed] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    startTransition(async () => {
      // TODO: wire to a deleteAccount server action
      alert("מחיקת חשבון אינה מופעלת עדיין.");
      setConfirmed(false);
    });
  }

  return (
    <div className="flex items-center gap-3">
      {confirmed && (
        <span className="text-sm text-red-600 font-medium">
          בטוח? לחץ שוב לאישור
        </span>
      )}
      <Button
        variant="danger"
        size="sm"
        onClick={handleClick}
        disabled={isPending}
      >
        <Trash2 className="h-4 w-4" />
        {isPending ? "מוחק..." : confirmed ? "אשר מחיקה" : "מחק חשבון"}
      </Button>
      {confirmed && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfirmed(false)}
          disabled={isPending}
        >
          ביטול
        </Button>
      )}
    </div>
  );
}
