import { ListOnePlayer } from "@/services/PlayerServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const player = await ListOnePlayer({
        playerId: Number(req.query.playerId),
      });
      res.status(200).json(player);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
