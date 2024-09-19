import { ListMembers } from "@/services/GuildServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { guildId } = req.query;
    try {
      const { rankMembers, allMembers } = await ListMembers({
        guildId: Number(guildId),
      });
      res.status(200).json({ rankMembers, allMembers });
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
