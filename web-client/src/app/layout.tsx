import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import LayoutProvider from "@/provider/LayoutProvider";

const font = Poppins({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Vimero",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} bg-background`}>
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  );
}
