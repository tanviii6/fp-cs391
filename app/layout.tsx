import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth, signOut } from "@/auth";
import SignOut from "@/components/authentication/sign-out";
import SignIn from "@/components/authentication/sign-in";

//todo: I put a placeholder nav bar for now, going to implement once we confirm all the featues

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SessionWrapper from "./SessionWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movie App",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#14181C]`}
      >
<<<<<<< HEAD
        <SessionWrapper>
            <Header />

            <div id="content-wrapper" className="w-[950px] mx-auto my-0">
                {children}
            </div>
            <Footer />
        </SessionWrapper>
=======
        <nav className="p-4 flex justify-between items-center bg-gray-900 text-white mb-4">
          <h1 className="text-xl font-bold">Movie App</h1>

          {session?.user ? <SignOut name={session.user.name} /> : <SignIn />}
        </nav>
        <div
          id="content-wrapper"
          className="w-full max-w-[950px] mx-auto my-0 px-4"
        >
          {children}
        </div>
>>>>>>> 90fd54549ba971950a2c799bbbea03c8f54bd64c
      </body>
    </html>
  );
}
