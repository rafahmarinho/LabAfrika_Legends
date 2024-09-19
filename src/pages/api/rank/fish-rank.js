import { GetFishRank } from "@/services/RankingServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { order, page, perPage } = req.query;
      const { fishRank, count } = await GetFishRank({
        order,
        page,
        perPage,
      });
      res.status(200).json({ fishRank, count });
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
