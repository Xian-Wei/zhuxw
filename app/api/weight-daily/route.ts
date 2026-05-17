import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore/lite";

export async function GET() {
  try {
    const docRef = doc(db, "weights", "xw");
    const docSnap = await getDoc(docRef);
    const dataArray = docSnap.data();
    if (dataArray) return Response.json(dataArray.weights);
    return Response.json(
      { message: "Couldn't fetch weights" },
      { status: 404 },
    );
  } catch (e: any) {
    return Response.json({ message: String(e) }, { status: 500 });
  }
}
