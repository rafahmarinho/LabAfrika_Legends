import { CreateTicket } from "@/services/AccountServices";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { title, description, userId, typeId, value } = req.body;
    try {
      const ticket = await CreateTicket({
        title,
        description,
        userId,
        typeId,
        value,
      });
      res.status(200).json(ticket);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
