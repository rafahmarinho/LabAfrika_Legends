import { GetLevelRank } from "@/services/RankingServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { order, page, perPage } = req.query;
      const { levelRank, count } = await GetLevelRank({ order, page, perPage });
      res.status(200).json({ levelRank, count });
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
