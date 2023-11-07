import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

type ResponseData = {
  message: string;
};

function calculateWeeklyWeights(data: any) {
  const weeklyWeights = [];
  let allWeightsInWeek = [];

  for (let i = 0; i < data.length; i++) {
    allWeightsInWeek.push(data[i]);

    if (allWeightsInWeek.length === 7) {
      const weightEntry = {
        time: allWeightsInWeek[0].time,
        open: allWeightsInWeek[0].open,
        high: Math.max(...allWeightsInWeek.map((weight) => weight.high)),
        low: Math.min(...allWeightsInWeek.map((weight) => weight.low)),
        close: allWeightsInWeek[allWeightsInWeek.length - 1].close,
      };
      weeklyWeights.push(weightEntry);
      allWeightsInWeek = [];
    }
  }
  return weeklyWeights;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const docRef = doc(db, "weights", "xw");
    const docSnap = await getDoc(docRef);
    const dataArray = docSnap.data();

    if (dataArray) {
      const weeklyWeights = calculateWeeklyWeights(dataArray.weights);

      res.status(200).json(weeklyWeights as any);
    }
  } catch (e: any) {
    res.status(404).json({ message: e });
  }
}
