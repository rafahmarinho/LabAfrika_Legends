import { ListTopLevel } from "@/services/PlayerServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const topPlayers = await ListTopLevel();
      res.status(200).json(topPlayers);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
