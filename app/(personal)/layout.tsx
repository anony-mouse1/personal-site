import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./personal.css";

export const metadata: Metadata = {
  title: "Fatimah Hussain · About",
  description:
    "Fatimah Hussain: creator and builder helping students afford college. Founder of Fatimah's Guide (200M+ views) and finnie. Featured in The New York Times, USA Today, and Fast Company.",
  openGraph: {
    title: "Fatimah Hussain",
    description:
      "Creator & builder helping students afford college. Founder of Fatimah's Guide and finnie.",
  },
  icons: { icon: "/favicon.png" },
};

export default function PersonalLayout({ children }: { children: ReactNode }) {
  return (
    // Browser extensions (e.g. recorders) tack attributes onto <html> before
    // hydration; suppress the attribute-mismatch warning on this element only.
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
