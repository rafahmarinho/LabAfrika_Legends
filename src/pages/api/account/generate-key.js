// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { GenerateRecoveryKey } from "@/services/AccountServices";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { userId } = req.body;
      const key = await GenerateRecoveryKey({
        userId: Number(userId),
      });
      res.status(200).json(key);
    } catch (err) {
      console.log(err);
      res.status(400).json(err.message);
    }
  }
}
