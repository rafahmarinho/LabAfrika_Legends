import { EditNews } from "@/services/AdminServices";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { title, body, newsId } = req.body;
    try {
      const news = await EditNews({
        title,
        body,
        newsId: Number(newsId),
      });
      res.status(200).json(news);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
