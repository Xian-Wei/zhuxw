import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

type ResponseData = {
  message: string;
};

function calculateWeeklyWeights(data: any) {
  const weeklyWeights = [];
  let allWeightsInWeek = [];

 
  for (let i = 1; i < data.length; i += 7) {
    const weekSlice = data.slice(i, i + 7);
    const closes = weekSlice.map((entry: any) => Number(entry.close)).filter((val: any) => !isNaN(val));

    if (closes.length === 0) continue;

    weeklyWeights.push({
      time: weekSlice[0].time,
      open: weekSlice[0].open,
      close: weekSlice[weekSlice.length - 1].close,
      high: Math.max(...closes),
      low: Math.min(...closes),
    });
  }

  return weeklyWeights;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  try {
    const docRef = doc(db, "weights", "xw");
    const docSnap = await getDoc(docRef);
    const dataArray = docSnap.data();

    if (dataArray) {
      const weeklyWeights = calculateWeeklyWeights(dataArray.weights);

      res.status(200).json(weeklyWeights as any);
    } else return res.status(404).json({ message: "Couldn't fetch weights" });
  } catch (e: any) {
    res.status(404).json({ message: e });
  }
}
