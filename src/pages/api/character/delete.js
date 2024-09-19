import { DeleteCharacter } from "@/services/PlayerServices";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      const character = await DeleteCharacter({
        playerId: Number(req.body.playerId),
      });
      res.status(200).json(character);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
