import { GetLastCaught } from "@/services/PlayerServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const lastCaught = await GetLastCaught();
      res.status(200).json(lastCaught);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
