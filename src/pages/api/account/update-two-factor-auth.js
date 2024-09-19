import { UpdateTwoFactorAuth } from "@/services/AccountServices";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      const { twoFactorAuth, password, confirmPassword, userId } = req.body;
      const updatedAccount = await UpdateTwoFactorAuth({
        userId: Number(userId),
        twoFactorAuth,
        password,
        confirmPassword,
      });
      res.status(200).json(updatedAccount);
    } catch (err) {
      console.log(err);
      res.status(400).json(err.message);
    }
  }
}
