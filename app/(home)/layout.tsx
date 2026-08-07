import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./home.css";

export const metadata: Metadata = {
  title: "fatimahs.guide",
  description:
    "Fatimah Hussain: creator and builder helping students afford college. Free scholarship tools, templates, mentorship, and more.",
  openGraph: {
    title: "fatimahs.guide",
    description:
      "Creator & builder helping students afford college. Founder of Fatimah's Guide and finnie.",
  },
  icons: { icon: "/favicon.png" },
};

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    // Browser extensions (e.g. recorders) tack attributes onto <html> before
    // hydration; suppress the attribute-mismatch warning on this element only.
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
