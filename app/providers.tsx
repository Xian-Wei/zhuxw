"use client";

import { Analytics } from "@vercel/analytics/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Analytics debug={false} />
    </>
  );
}
