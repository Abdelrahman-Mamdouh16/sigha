"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils/cn";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center rounded-full border border-(--color-border-strong) p-0.5 text-xs cursor-pointer">
      <button
        type="button"
        onClick={() => setLocale("ar")}
        className={cn(
          "rounded-full px-2.5 py-1.5 font-medium transition-colors cursor-pointer",
          locale === "ar" ? "bg-(--color-deep) text-(--color-paper-raised)" : "text-(--color-ink-muted)"
        )}
        aria-pressed={locale === "ar"}
      >
        العربية
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={cn(
          "rounded-full px-2.5 py-1.5 font-medium transition-colors cursor-pointer",
          locale === "en" ? "bg-(--color-deep) text-(--color-paper-raised)" : "text-(--color-ink-muted)"
        )}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  );
}
