import { CreateTwitchId } from "@/services/TwitchServices";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { twitchLogin, userId, characterToStream } = req.body;
    try {
      const user = await CreateTwitchId({
        twitchLogin,
        userId,
        characterToStream,
      });
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
