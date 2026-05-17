"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import { Analytics } from "@vercel/analytics/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <Analytics debug={false} />
    </Provider>
  );
}
