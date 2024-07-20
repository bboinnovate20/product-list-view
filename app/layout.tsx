import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sly Bar Night Club",
  description: "Sly Bar Night Club descriptions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className=" pb-10">
          {children}
        </div>

        <footer className="bg-black pb-6 pt-5 relative bottom-0 w-full h-[70px]">
          <p className="text-white text-center ">© 2024 Sly Bar Night Club. All rights reserved.</p>
        </footer>
      </body>

    </html>
  );
}
