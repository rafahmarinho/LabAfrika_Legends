import { ListDonates } from "@/services/PagbankServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const donates = await ListDonates();
      res.status(200).json(donates);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
