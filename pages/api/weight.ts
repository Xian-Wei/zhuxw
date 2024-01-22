import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Weight } from "../../models/Weight";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  if (req.headers.key == process.env.NEXT_PUBLIC_ZHUXW_API_KEY) {
    if (req.body.date && req.body.weight && dateRegex.test(req.body.date)) {
      try {
        const docRef = doc(db, "weights", "xw");
        const docSnap = await getDoc(docRef);
        const weights = docSnap.data()?.weights as Weight[];
        let weightsIndex = -1;
        let newWeight: Weight = {
          time: req.body.date,
          open: -1,
          high: -1,
          low: -1,
          close: Number(req.body.weight),
        };

        weights.map((weight: Weight, index) => {
          if (weight.time == req.body.date) {
            weightsIndex = index;
          }
        });

        if (weightsIndex === -1) {
          newWeight.open = Number(weights[weights.length - 1].close);
          newWeight.high =
            req.body.weight >= weights[weights.length - 1].close
              ? Number(req.body.weight)
              : Number(weights[weights.length - 1].close);
          newWeight.low =
            req.body.weight >= weights[weights.length - 1].close
              ? Number(weights[weights.length - 1].close)
              : Number(req.body.weight);

          weights.push(newWeight);

          await setDoc(doc(db, "weights", "xw"), { weights: weights });

          res.status(200).send({ message: "Added new weight" });
        } else {
          newWeight.open = Number(weights[weights.length - 2].close);
          newWeight.high =
            req.body.weight >= weights[weights.length - 2].close
              ? Number(req.body.weight)
              : Number(weights[weights.length - 2].close);
          newWeight.low =
            req.body.weight >= weights[weights.length - 2].close
              ? Number(weights[weights.length - 2].close)
              : Number(req.body.weight);

          weights[weightsIndex] = newWeight;

          await setDoc(doc(db, "weights", "xw"), { weights: weights });

          res.status(200).send({ message: "Updated weight" });
        }
      } catch (e: any) {
        res.status(404).json({ message: e });
      }
    } else {
      res.status(400).send({ message: "Wrong format" });
    }
  } else {
    res.status(401).send({ message: "Invalid API key" });
  }
}
