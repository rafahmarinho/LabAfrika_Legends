import { GetPopUpStreamer } from "@/services/TwitchServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const streamer = await GetPopUpStreamer();
      res.status(200).json(streamer);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
