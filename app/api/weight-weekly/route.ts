import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore/lite";

function calculateWeeklyWeights(data: any) {
  const weeklyWeights = [];

  for (let i = 1; i < data.length; i += 7) {
    const weekSlice = data.slice(i, i + 7);
    const closes = weekSlice
      .map((entry: any) => Number(entry.close))
      .filter((val: any) => !isNaN(val));

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

export async function GET() {
  try {
    const docRef = doc(db, "weights", "xw");
    const docSnap = await getDoc(docRef);
    const dataArray = docSnap.data();

    if (dataArray) {
      const weeklyWeights = calculateWeeklyWeights(dataArray.weights);
      return Response.json(weeklyWeights);
    }
    return Response.json(
      { message: "Couldn't fetch weights" },
      { status: 404 },
    );
  } catch (e: any) {
    return Response.json({ message: String(e) }, { status: 500 });
  }
}
