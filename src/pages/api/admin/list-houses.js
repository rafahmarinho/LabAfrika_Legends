import { ListHouses } from "@/services/AdminServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { page, perPage, search, town } = req.query;
      const { houses, count } = await ListHouses({
        page,
        perPage,
        search,
        town,
      });
      res.status(200).json({ houses, count });
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
