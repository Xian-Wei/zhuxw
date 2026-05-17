import type { Metadata } from "next";
import ShopPage from "./ShopPage";

export const metadata: Metadata = {
  title: "zhuxw web3 shop",
};

export default function Page() {
  return <ShopPage />;
}
