import { UpdateTicketStatus } from "@/services/AccountServices";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      const { statusId, ticketId } = req.body;
      const status = await UpdateTicketStatus({
        statusId: Number(statusId),
        ticketId: Number(ticketId),
      });
      res.status(200).json(status);
    } catch (err) {
      console.log(err);
      res.status(400).json(err.message);
    }
  }
}
