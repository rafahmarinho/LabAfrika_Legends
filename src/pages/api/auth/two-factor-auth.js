import { TwoFactorAuthLogin } from "@/services/AuthServices/TwoFactorAuth";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { code } = req.body;
      const { token, user } = await TwoFactorAuthLogin({
        code,
      });
      res.status(200).json({ token, user });
    } catch (err) {
      console.log(err);
      res.status(400).json(err.message);
    }
  }
}
