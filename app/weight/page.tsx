import type { Metadata } from "next";
import WeightPage from "./WeightPage";

export const metadata: Metadata = {
  title: "zhuxw weight",
};

export default function Page() {
  return <WeightPage />;
}
