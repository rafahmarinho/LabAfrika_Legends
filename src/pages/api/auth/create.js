import { CreateAccount } from "@/services/AuthServices/CreateAccount";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { nickname, password, email, name } = req.body;
      const { token, user } = await CreateAccount({
        nickname,
        email,
        password,
        name,
      });
      res.status(200).json({ token, user });
    } catch (err) {
      console.log(err);
      res.status(400).json(err.message);
    }
  }
}
