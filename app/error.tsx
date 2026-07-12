"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen bg-cream flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-3xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-red-400" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-stone-800 mb-2">משהו השתבש</h2>
          <p className="text-sm text-stone-500 mb-8 leading-relaxed">
            אירעה שגיאה בלתי צפויה.<br />
            נסה לרענן את הדף או חזור לדף הראשי.
          </p>

          <div className="flex justify-center gap-3">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl bg-amber px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-amber/90 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              נסה שוב
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-amber/30 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-amber/5 transition-colors"
            >
              <Home className="h-4 w-4" />
              דף ראשי
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
