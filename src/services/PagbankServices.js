import { knex } from "@/db/knex";
import { twitchApiInstance } from "@/utils/twitch";
import axios from "axios";

const CreateCheckout = async ({ donationValue, accountId, cupom }) => {
  if (!donationValue) {
    throw new Error("Insira um valor de doação para continuar");
  }

  if (Number(donationValue) < 500) {
    throw new Error("O valor mínimo para doação é de R$5,00");
  }

  function generateUUID() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (
      s4() +
      s4() +
      "-" +
      s4() +
      "-4" +
      s4().substr(0, 3) +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4()
    );
  }

  const uuid = generateUUID();

  const convertToCents = (formattedValue) => {
    const valueWithoutCommaOrDot = formattedValue.replace(/[,.]/g, "");

    return valueWithoutCommaOrDot;
  };

  const options = {
    method: "POST",
    url: `${process.env.PAGBANK_ENDPOINT}/checkouts`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.PAGBANK_TOKEN}`,
      "Content-type": "application/json",
    },
    data: {
      items: [
        {
          reference_id: 1,
          name: "Doação - LoU",
          quantity: 1,
          unit_amount: convertToCents(donationValue),
        },
      ],
      reference_id: uuid,
      customer_modifiable: true,
      notification_urls: [`${process.env.PAGBANK_WEBHOOK_URL}`],
      redirect_url: `${process.env.PAGBANK_REDIRECT_URL}/confirm/${uuid}`,
    },
  };

  try {
    await knex("donates").insert({
      account_id: accountId,
      ref: uuid,
      cupom: cupom ? cupom : "",
    });

    const res = await axios.request(options);

    const link = res.data.links.find((item) => item.rel === "PAY");
    const response = {
      msg: "Ir para o pagamento:",
      href: link.href,
    };

    return response;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const Webhook = async ({ body }) => {
  const removeTrailingZeros = (value) => {
    let stringValue = value.toString();

    stringValue = stringValue.slice(0, -2);

    if (stringValue === "") {
      return "0";
    }

    return stringValue;
  };
  try {
    function convertDateToUnix(date) {
      const data = new Date(date);
      return Math.floor(data.getTime() / 1000);
    }

    if (body.charges[0].status !== "PAID") {
      throw new Error("Pagamento nao concluído");
    }

    const checkDonate = await knex("donates")
      .select("*")
      .where({
        ref: body.reference_id,
      })
      .first();

    if (!checkDonate) {
      throw new Error("Doação não encontrada, verificar no painel PagBank");
    }

    const donate = await knex("donates")
      .where({
        id: checkDonate.id,
      })
      .update({
        value: body.items[0].unit_amount,
        date: convertDateToUnix(body.charges[0].created_at),
      });

    const donation = await knex("donates")
      .select("*")
      .where({ id: checkDonate.id })
      .first();

    const user = await knex("accounts")
      .select("*")
      .where({ id: donation.account_id })
      .first();

    await knex("accounts")
      .where({ id: user.id })
      .update({
        soulcoins: removeTrailingZeros(body.items[0].unit_amount),
      });

    return donate;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const ListDonates = async () => {
  try {
    const data = await knex("donates").select("*").orderBy("id", "desc");

    let donates = [];

    for (const donate of data) {
      const user = await knex("accounts")
        .select("name")
        .where({ id: donate.account_id })
        .first();

      donates.push({
        ...donate,
        user_name: user.name,
      });
    }

    return donates;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const ListDonatesByUser = async ({ userId }) => {
  try {
    const data = await knex("donates")
      .select("*")
      .where({ account_id: userId })
      .orderBy("id", "desc");

    let donates = [];

    for (const donate of data) {
      const user = await knex("accounts")
        .select("name")
        .where({ id: donate.account_id })
        .first();

      donates.push({
        ...donate,
        user_name: user.name,
      });
    }

    return donates;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export { CreateCheckout, Webhook, ListDonates, ListDonatesByUser };
