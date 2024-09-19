import { Webhook } from "@/services/PagbankServices";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const donate = await Webhook({
        body: req.body,
      });
      res.status(200).json(donate);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
