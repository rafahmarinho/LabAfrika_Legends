import { GetMessageTickets } from "@/services/AccountServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const msgTickets = await GetMessageTickets({
        ticketId: req.query.ticketId,
      });
      res.status(200).json(msgTickets);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
