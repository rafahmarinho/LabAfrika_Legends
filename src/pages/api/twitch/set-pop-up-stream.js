import { SetPopUpStreamAccount } from "@/services/TwitchServices";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      const { userId } = req.body;
      const user = await SetPopUpStreamAccount({ userId });
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
