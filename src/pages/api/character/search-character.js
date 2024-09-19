import { SearchCharacters } from "@/services/PlayerServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { search, page, perPage } = req.query;
      const characters = await SearchCharacters({
        search,
        page,
        perPage,
      });
      res.status(200).json(characters);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
