import { CreateMessagesTicket } from "@/services/AccountServices";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { ticketId, message, userId } = req.body;
    try {
      const ticketMessage = await CreateMessagesTicket({
        ticketId,
        message,
        userId,
      });
      res.status(200).json(ticketMessage);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
