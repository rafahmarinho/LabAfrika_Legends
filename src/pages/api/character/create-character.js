import { CreateCharacter } from "@/services/PlayerServices";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, gender, accountId } = req.body;
    try {
      const character = await CreateCharacter({ name, gender, accountId });
      res.status(200).json(character);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
