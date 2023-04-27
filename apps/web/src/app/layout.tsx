import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

import ClientProviders from "./client-providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClientProviders>
        <body>{children}</body>
        <Analytics />
      </ClientProviders>
    </html>
  );
}
