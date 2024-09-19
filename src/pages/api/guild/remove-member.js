import { RemoveMember } from "@/services/GuildServices";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { playerId, guildName } = req.body;

    try {
      const player = await RemoveMember({
        playerId,
        guildName,
      });
      res.status(200).json(player);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
