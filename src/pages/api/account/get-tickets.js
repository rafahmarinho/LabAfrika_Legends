import { GetTickets } from "@/services/AccountServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const tickets = await GetTickets({
        userId: req.query.userId,
      });
      res.status(200).json(tickets);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
