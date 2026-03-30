"use client";

import { SessionProvider as ProviderSession } from "next-auth/react";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProviderSession>{children}</ProviderSession>;
}
