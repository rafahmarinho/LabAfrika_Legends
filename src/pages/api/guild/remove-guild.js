import { DeleteGuild } from "@/services/GuildServices";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    try {
      const guild = await DeleteGuild({
        guildId: req.query.guildId,
      });
      res.status(200).json(guild);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
