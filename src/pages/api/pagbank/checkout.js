import { CreateCheckout } from "@/services/PagbankServices";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { donationValue, accountId, cupom } = req.body;
    try {
      const response = await CreateCheckout({
        donationValue,
        accountId: Number(accountId),
        cupom,
      });
      res.status(200).json(response);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}
