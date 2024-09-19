import { GetCatchRank } from "@/services/RankingServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { order, page, perPage } = req.query;
      const { catchRank, count } = await GetCatchRank({ order, page, perPage });
      res.status(200).json({ catchRank, count });
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
