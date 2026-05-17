import type { Metadata } from "next";
import "../styles/globals.scss";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "zhuxw",
  description:
    "zhuxw - Navigate through the virtual void where excitement takes a vacation, and innovation is on sabbatical.",
  openGraph: {
    images: [{ url: "https://zhuxw.com/images/metalogo.png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
