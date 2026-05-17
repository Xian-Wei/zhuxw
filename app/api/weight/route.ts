import { db } from "../../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Weight } from "../../../models/Weight";

export async function POST(request: Request) {
  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

  if (request.headers.get("key") == process.env.NEXT_PUBLIC_ZHUXW_API_KEY) {
    const body = await request.json();

    if (body.date && body.weight && dateRegex.test(body.date)) {
      try {
        const docRef = doc(db, "weights", "xw");
        const docSnap = await getDoc(docRef);
        const weights = docSnap.data()?.weights as Weight[];
        let weightsIndex = -1;
        let newWeight: Weight = {
          time: body.date,
          open: -1,
          close: Number(body.weight),
        };

        weights.map((weight: Weight, index) => {
          if (weight.time == body.date) {
            weightsIndex = index;
          }
        });

        if (weightsIndex === -1) {
          newWeight.open = Number(weights[weights.length - 1].close);

          weights.push(newWeight);

          await setDoc(doc(db, "weights", "xw"), { weights: weights });

          return Response.json({ message: "Added new weight" });
        } else {
          newWeight.open = Number(weights[weights.length - 2].close);

          weights[weightsIndex] = newWeight;

          await setDoc(doc(db, "weights", "xw"), { weights: weights });

          return Response.json({ message: "Updated weight" });
        }
      } catch (e: any) {
        return Response.json({ message: String(e) }, { status: 500 });
      }
    } else {
      return Response.json({ message: "Wrong format" }, { status: 400 });
    }
  } else {
    return Response.json({ message: "Invalid API key" }, { status: 401 });
  }
}
