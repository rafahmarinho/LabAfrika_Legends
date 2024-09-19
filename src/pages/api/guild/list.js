import { ListGuilds } from "@/services/GuildServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { name, page, perPage } = req.query;
    try {
      const { guilds, count } = await ListGuilds({
        name,
        page,
        perPage,
      });
      res.status(200).json({ guilds, count });
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
