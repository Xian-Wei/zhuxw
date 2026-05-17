import { db } from "../../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { WorkoutItem } from "../../../models/WorkoutItem";
import { getCurrentYear } from "../../../utils/Date";

export async function GET() {
  try {
    const docRef = doc(db, "workouts", "xw");
    const docSnap = await getDoc(docRef);
    const dataArray = docSnap.data();

    if (dataArray) return Response.json(dataArray.workouts);
    return Response.json(
      { message: "Couldn't fetch workouts" },
      { status: 404 },
    );
  } catch (e: any) {
    return Response.json({ message: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (request.headers.get("key") == process.env.NEXT_PUBLIC_ZHUXW_API_KEY) {
    const body = await request.json();
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

    if (
      body.date &&
      body.muscle &&
      typeof body.gym == "boolean" &&
      dateRegex.test(body.date)
    ) {
      if (body.date.substring(0, 4) == getCurrentYear()) {
        try {
          const docRef = doc(db, "workouts", "xw");
          const docSnap = await getDoc(docRef);
          const workouts = docSnap.data()?.workouts as WorkoutItem[];
          let workoutIndex = -1;

          const newWorkout: WorkoutItem = {
            date: body.date,
            muscle: body.muscle,
            gym: body.gym,
          };

          workouts.map((workout: WorkoutItem, index) => {
            if (workout.date == newWorkout.date) {
              workoutIndex = index;
            }
          });

          if (workoutIndex == -1) {
            workouts.push(newWorkout);

            await setDoc(doc(db, "workouts", "xw"), { workouts: workouts });

            return Response.json({ message: "Added new workout" });
          } else {
            workouts[workoutIndex] = newWorkout;

            await setDoc(doc(db, "workouts", "xw"), { workouts: workouts });

            return Response.json({ message: "Updated workout" });
          }
        } catch (e: any) {
          return Response.json({ message: String(e) }, { status: 500 });
        }
      } else {
        return Response.json(
          { message: `Can only add or update ${getCurrentYear()} entries` },
          { status: 400 },
        );
      }
    } else {
      console.log(`${body.date} ${body.muscle} ${body.gym}`);
      return Response.json({ message: "Wrong format" }, { status: 400 });
    }
  } else {
    return Response.json({ message: "Invalid API key" }, { status: 401 });
  }
}
