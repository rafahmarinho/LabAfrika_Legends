import { GetPokedex } from "@/services/PokemonServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const dexArr = await GetPokedex({
        playerId: req.query.playerId,
      });
      res.status(200).json(dexArr);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
