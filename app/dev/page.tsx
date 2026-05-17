import type { Metadata } from "next";
import DevPage from "./DevPage";

export const metadata: Metadata = {
  title: "zhuxw dev",
};

export default function Page() {
  return <DevPage />;
}
