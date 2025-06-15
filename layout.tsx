import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Polyglot Vision | Multilingual Image Captioning and Narration System",
  description:
    "An innovative AI-powered system that generates image captions using deep learning, converts them to speech, and delivers multilingual audio outputs in English, Hindi, and Tamil. Perfect for accessibility and global applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="sunset">
      <body className={`antialiased`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
