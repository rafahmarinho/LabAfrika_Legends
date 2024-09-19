import { ChangePassword } from "@/services/AuthServices/ChangePassword";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      const { oldPassword, newPassword, userId } = req.body;
      const response = await ChangePassword({
        userId: Number(userId),
        oldPassword,
        newPassword,
      });
      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res.status(400).json(err.message);
    }
  }
}
