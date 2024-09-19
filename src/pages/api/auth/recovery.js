// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { RecoveryPassword } from "@/services/AuthServices/RecoveryPassword";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      const { name, recoveryKey, password, confirmPassword } = req.body;
      const user = await RecoveryPassword({
        name,
        recoveryKey,
        password,
        confirmPassword,
      });
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
