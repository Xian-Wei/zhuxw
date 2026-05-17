import type { Metadata } from "next";
import WorkoutPage from "./WorkoutPage";

export const metadata: Metadata = {
  title: "zhuxw workouts",
};

export default function Page() {
  return <WorkoutPage />;
}
