import { ListStreamers } from "@/services/TwitchServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const streamers = await ListStreamers();
      res.status(200).json(streamers);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
