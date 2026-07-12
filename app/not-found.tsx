import Link from "next/link";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6" dir="rtl">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-3xl bg-amber/10 flex items-center justify-center">
            <SearchX className="h-10 w-10 text-amber" />
          </div>
        </div>

        <h1 className="text-6xl font-black text-stone-200 mb-2">404</h1>
        <h2 className="text-xl font-bold text-stone-800 mb-2">הדף לא נמצא</h2>
        <p className="text-sm text-stone-500 mb-8 leading-relaxed">
          הדף שחיפשת לא קיים או הוסר.<br />
          בדוק את הכתובת ונסה שוב.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-amber px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-amber/90 transition-colors"
        >
          <Home className="h-4 w-4" />
          חזור לדף הראשי
        </Link>
      </div>
    </div>
  );
}
