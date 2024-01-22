import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

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
    res.status(404).send({ message: "Work in progress" });
    return;
  } else {
    res.status(405).send({ message: "Request method not allowed" });
  }
}
