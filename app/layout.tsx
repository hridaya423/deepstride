import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeepStride",
  description: "Transform your learning journey into achievable steps. Set your goal, and let AI craft your personalized path to success.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
