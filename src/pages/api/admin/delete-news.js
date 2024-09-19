import { DeleteNews } from "@/services/AdminServices";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    try {
      const news = await DeleteNews({
        newsId: req.query.newsId,
      });
      res.status(200).json(news);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
