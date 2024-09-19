import { GetHeadbuttRank } from "@/services/RankingServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { order, page, perPage } = req.query;
      const { headbuttRank, count } = await GetHeadbuttRank({
        order,
        page,
        perPage,
      });
      res.status(200).json({ headbuttRank, count });
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
