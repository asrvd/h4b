import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { validateRequest } from "@/lib/auth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Satya",
  description: "Microreporting platform for humans.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, session } = await validateRequest();
  return (
    <html lang="en">
      <body className={inter.className + "flex flex-col gap-4 justify-center items-center bg-background"}>
        <Navbar session={session} user={user} />
        {children}
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
