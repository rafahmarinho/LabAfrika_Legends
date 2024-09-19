import { GetTeam } from "@/services/PokemonServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const team = await GetTeam({
        playerId: req.query.playerId,
      });
      res.status(200).json(team);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
