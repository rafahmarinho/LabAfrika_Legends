import { ListCharacters } from "@/services/PlayerServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const characters = await ListCharacters({
        userId: Number(req.query.userId),
      });
      res.status(200).json(characters);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}