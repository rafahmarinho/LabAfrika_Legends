import { GetUsers } from "@/services/AccountServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { users, streamers } = await GetUsers();
      res.status(200).json({ users, streamers });
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
