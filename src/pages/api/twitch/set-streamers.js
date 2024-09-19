import { SetStreamers } from "@/services/TwitchServices";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      const { userArr } = req.body;
      const streamers = await SetStreamers({ userArr });
      res.status(200).json(streamers);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
