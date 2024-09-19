import { ListNews } from "@/services/AdminServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { page, perPage } = req.query;
      const { news, count } = await ListNews({ page, perPage });
      res.status(200).json({ news, count });
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
