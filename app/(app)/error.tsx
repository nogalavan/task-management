"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6" dir="rtl">
      <div className="h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
        <AlertTriangle className="h-8 w-8 text-red-400" />
      </div>

      <h2 className="text-lg font-bold text-stone-800 mb-2">שגיאה בטעינת הדף</h2>
      <p className="text-sm text-stone-500 mb-6 max-w-sm leading-relaxed">
        אירעה שגיאה זמנית. נסה לרענן את הדף.
        {error.digest && (
          <span className="block mt-1 text-xs text-stone-400">
            קוד שגיאה: {error.digest}
          </span>
        )}
      </p>

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl bg-amber px-4 py-2 text-sm font-medium text-white hover:bg-amber/90 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          נסה שוב
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-amber/30 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-amber/5 transition-colors"
        >
          <Home className="h-4 w-4" />
          לוח ראשי
        </Link>
      </div>
    </div>
  );
}
