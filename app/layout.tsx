import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth, signOut } from "@/auth";
import SignOut from "@/components/authentication/sign-out";
import SignIn from "@/components/authentication/sign-in";


//todo: I put a placeholder nav bar for now, going to implement once we confirm all the featues

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
        <nav className="p-4 flex justify-between items-center bg-gray-900 text-white">
          <h1 className="text-xl font-bold">Movie App</h1>

          {session?.user ? (
            <SignOut name={session.user.name} />
          ) : (
            <SignIn/>
          )}
        </nav>
        <div id="content-wrapper" className="w-[950px] mx-auto my-0">
          {children}
        </div>
      </body>
    </html>
  );
}
