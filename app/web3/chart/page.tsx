import type { Metadata } from "next";
import ChartPage from "./ChartPage";

export const metadata: Metadata = {
  title: "zhuxw web3 chart",
};

export default function Page() {
  return <ChartPage />;
}
