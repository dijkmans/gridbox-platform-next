import type { Metadata } from "next";
import "./globals.css"; // <--- DIT IS CRUCIAAL VOOR DE GROENE KLEUREN

export const metadata: Metadata = {
  title: "Gridbox Portal",
  description: "Device Agent Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
