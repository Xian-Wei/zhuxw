import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { WorkoutItem } from "../../models/WorkoutItem";
import { getCurrentYear } from "../../utils/Date";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method == "GET") {
    try {
      const docRef = doc(db, "workouts", "xw");
      const docSnap = await getDoc(docRef);
      const dataArray = docSnap.data();

      if (dataArray) res.status(200).json(dataArray.workouts);
      else return res.status(404).json({ message: "Couldn't fetch workouts" });
    } catch (e: any) {
      res.status(404).json({ message: e });
    }
  } else if (req.method == "POST") {
    if (req.headers.key == process.env.NEXT_PUBLIC_ZHUXW_API_KEY) {
      const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

      if (
        req.body.date &&
        req.body.muscle &&
        typeof req.body.gym == "boolean" &&
        dateRegex.test(req.body.date)
      ) {
        if (req.body.date.substring(0, 4) == getCurrentYear()) {
          try {
            const docRef = doc(db, "workouts", "xw");
            const docSnap = await getDoc(docRef);
            const workouts = docSnap.data()?.workouts as WorkoutItem[];
            let workoutIndex = -1;

            const newWorkout: WorkoutItem = {
              date: req.body.date,
              muscle: req.body.muscle,
              gym: req.body.gym,
            };

            workouts.map((workout: WorkoutItem, index) => {
              if (workout.date == newWorkout.date) {
                workoutIndex = index;
              }
            });

            if (workoutIndex == -1) {
              workouts.push(newWorkout);

              await setDoc(doc(db, "workouts", "xw"), { workouts: workouts });

              res.status(200).send({ message: "Added new workout" });
            } else {
              workouts[workoutIndex] = newWorkout;

              await setDoc(doc(db, "workouts", "xw"), { workouts: workouts });

              res.status(200).send({ message: "Updated workout" });
            }
          } catch (e: any) {
            res.status(404).json({ message: e });
          }
        } else {
          res.status(400).send({
            message: `Can only add or update ${getCurrentYear()} entries`,
          });
        }
      } else {
        console.log(`${req.body.date} ${req.body.muscle} ${req.body.gym}`);
        res.status(400).send({ message: "Wrong format" });
      }
    } else {
      res.status(401).send({ message: "Invalid API key" });
    }
  } else {
    res.status(405).send({ message: "Request method not allowed" });
  }
}
