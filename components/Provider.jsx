"use client";
import { SessionProvider } from "next-auth/react";

export default function Provider({ children, session }) {
  return (
    <SessionProvider refetchOnWindowFocus={false} session={session}>
      {children}
    </SessionProvider>
  );
}
