import { Providers } from "@/components/Providers";
import { getUserId } from "@/lib/server/userId";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Hindsight",
  description: "...",
};

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  const userId = getUserId();

  return (
    <html lang="en">
      <body>
        <Providers userId={userId}>{children}</Providers>
      </body>
    </html>
  );
}
