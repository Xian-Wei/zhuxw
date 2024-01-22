import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  try {
    const docRef = doc(db, "weights", "xw");
    const docSnap = await getDoc(docRef);
    const dataArray = docSnap.data();

    if (dataArray) res.status(200).json(dataArray.weights);
    else return res.status(404).json({ message: "Couldn't fetch weights" });
  } catch (e: any) {
    res.status(404).json({ message: e });
  }
}
