import { GetStreams } from "@/services/TwitchServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const streams = await GetStreams();
      res.status(200).json(streams);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
