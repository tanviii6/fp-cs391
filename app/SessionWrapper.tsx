/*
  Created By: Charlie Howard
*/

"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function SessionWrapper({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
