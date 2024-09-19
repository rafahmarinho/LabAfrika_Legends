import { AuthServices } from "@/services/AuthServices/Auth";
import { RefreshToken } from "@/services/AuthServices/RefreshToken";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { name, password } = req.body;
      const response = await AuthServices({ name, password });
      res.status(200).json(response);
    } catch (err) {
      res.status(400).json(err.message);
    }
  } else if (req.method === "PUT") {
    try {
      const { tokenNumber } = req.body;
      const { token, user } = await RefreshToken({ tokenNumber });
      res.status(200).json({ token, user });
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
