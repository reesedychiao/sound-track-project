import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sound Track",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen bg-gradient-to-tr to-purple from-orange ${inter.className}`}
      >
        {children}
      </body>
    </html>
  );
}
