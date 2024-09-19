import { CreateNews } from "@/services/AdminServices";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { title, body, username } = req.body;
    try {
      const news = await CreateNews({
        title,
        body,
        username,
      });
      res.status(200).json(news);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
