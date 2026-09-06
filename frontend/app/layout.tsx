import type { Metadata } from "next";
import DarkModeProvider from "@/components/DarkModeProvider";

export const metadata: Metadata = {
  title: "MindSpace",
  description: "AI-Powered Mental Wellness Journal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Applies dark mode on every page before render */}
        <DarkModeProvider />
        {children}
      </body>
    </html>
  );
}