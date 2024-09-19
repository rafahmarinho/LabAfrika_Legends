import { ListGuildByAccount } from "@/services/GuildServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { userId } = req.query;
    try {
      const guilds = await ListGuildByAccount({
        userId,
      });
      res.status(200).json(guilds);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
