import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore/lite";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const before = searchParams.get("before");

    const docRef = doc(db, "weights", "xw");
    const docSnap = await getDoc(docRef);
    const dataArray = docSnap.data();
    if (dataArray) {
      let weights = dataArray.weights;
      if (before) {
        const idx = weights.findIndex((w: any) => w.time >= before);
        if (idx === 0) return Response.json([]);
        weights = idx > 0 ? weights.slice(0, idx) : weights;
      }
      const result = limit ? weights.slice(-Number(limit)) : weights;
      return Response.json(result);
    }
    return Response.json(
      { message: "Couldn't fetch weights" },
      { status: 404 },
    );
  } catch (e: any) {
    return Response.json({ message: String(e) }, { status: 500 });
  }
}
