import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { defaultLocale, LOCALE_COOKIE, locales, type Locale } from "@/lib/i18n/config";

// Self-hosted (not next/font/google): keeps the build free of any external network
// dependency and avoids relying on Google Fonts CDN reachability at build time.
const kufi = localFont({
  src: [
    { path: "./fonts/NotoKufiArabic-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/NotoKufiArabic-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-kufi",
  display: "swap",
});

const plexArabic = localFont({
  src: [
    { path: "./fonts/IBMPlexSansArabic-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/IBMPlexSansArabic-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/IBMPlexSansArabic-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/IBMPlexSansArabic-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-plex-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sigha.app"),
  title: {
    default: "صِيغة | Sigha — الصياغه القانونية، أصبحت أبسط",
    template: "%s | صِيغة",
  },
  description: "أنشئ مسودة مستند قانوني باللغة العربية بمساعدة الذكاء الاصطناعي، خلال دقائق.",
  openGraph: {
    title: "صِيغة | Sigha",
    description: "أنشئ مسودة مستند قانوني باللغة العربية بمساعدة الذكاء الاصطناعي، خلال دقائق.",
    locale: "ar_EG",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const initialLocale: Locale = locales.includes(cookieLocale as Locale) ? (cookieLocale as Locale) : defaultLocale;

  return (
    <html lang={initialLocale} dir={initialLocale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className={`${kufi.variable} ${plexArabic.variable} antialiased`}>
        <ThemeProvider>
          <LocaleProvider initialLocale={initialLocale}>{children}</LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
