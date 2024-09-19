import { CreateGuild } from "@/services/GuildServices";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, description, guildOwner, worldId } = req.body;
    try {
      const guild = await CreateGuild({
        name,
        description,
        guildOwner,
        worldId,
      });
      res.status(200).json(guild);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
