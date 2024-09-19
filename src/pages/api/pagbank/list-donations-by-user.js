import { ListDonatesByUser } from "@/services/PagbankServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      //   const { userId } = req.params;

      const donations = await ListDonatesByUser({
        userId: Number(req.query.userId),
      });
      res.status(200).json(donations);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
