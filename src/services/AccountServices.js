import { knex } from "@/db/knex";
import crypto from "crypto";

function generateRecoveryKey() {
  var key = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 36; i++) {
    key += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return key;
}

const GenerateRecoveryKey = async ({ userId }) => {
  try {
    const user = await knex("accounts").where({ id: userId }).first();

    if (user.key) {
      throw new Error("Recovery key já foi gerada");
    } else {
      const key = generateRecoveryKey();
      await knex("accounts").where({ id: userId }).update({ key: key });
      return key;
    }
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const GetTickets = async ({ userId }) => {
  try {
    const tickets = await knex("tickets")
      .where({ creator: userId })
      .orderBy("id", "desc");

    return tickets;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const GetAllTickets = async () => {
  try {
    const tickets = await knex("tickets").orderBy("created", "desc");
    let ticketsArr = [];

    if (tickets.length >= 1) {
      for (const ticket of tickets) {
        const ticketCreator = await knex("accounts")
          .where({ id: ticket.creator })
          .first();
        ticketsArr.push({
          ...ticket,
          creator: ticketCreator.name,
        });
      }
    } else {
      return (ticketsArr = []);
    }

    return ticketsArr;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const GetMessageTickets = async ({ ticketId }) => {
  const convertUnixToDate = (timestamp) => {
    if (timestamp === "0") return;
    const data = new Date(timestamp * 1000);
    return data.toLocaleString();
  };

  try {
    const msgTickets = await knex("ticket_messages")
      .where({ ticket_id: Number(ticketId) })
      .orderBy("created", "asc");

    // msgTickets.forEach((item) => {
    //   item.created = convertUnixToDate(item.created);
    // });

    return msgTickets;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const CreateTicket = async ({ title, description, userId, typeId, value }) => {
  //0 -> ticket aberto
  //1 -> ticket fechado
  //2 -> em analise
  //3 -> respondido > caso closed != 1
  //4 -> aprovado
  //5 -> recusado

  // type
  // 0 -> suporte ao jogador
  // 1 -> confirmar doações
  // 2 -> solicitação de saque

  const date = new Date().getTime();
  const unixDate = Math.floor(date / 1000);
  try {
    const ticket = await knex("tickets").insert({
      name: title,
      creator: Number(userId),
      type: Number(typeId),
      status: 0,
      created: unixDate,
      closed: 1,
      valor: Number(value),
    });

    await knex("ticket_messages").insert({
      ticket_id: Number(ticket[0]),
      message: description,
      created: new Date(),
      from_user: Number(userId),
    });
    return ticket;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const CreateMessagesTicket = async ({ ticketId, message, userId }) => {
  try {
    const ticket = await knex("tickets")
      .where({ id: Number(ticketId) })
      .first();

    const user = await knex("accounts")
      .where({ id: Number(userId) })
      .first();

    if (!ticket) {
      throw new Error("Ticket inexistente/não encontrado");
    }

    if (ticket) {
      const ticketMessage = await knex("ticket_messages").insert({
        ticket_id: Number(ticketId),
        message: message,
        created: new Date(),
        from_user: Number(userId),
      });

      if (!ticketMessage) {
        throw new Error("Erro ao enviar a mensagem");
      }

      if (user.group_id !== 1) {
        await knex("tickets")
          .where({ id: Number(ticketId) })
          .update({
            status: 3,
          });
      } else {
        await knex("tickets")
          .where({ id: Number(ticketId) })
          .update({
            status: 2,
          });
      }

      return ticketMessage;
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

const UpdateTicketStatus = async ({ statusId, ticketId }) => {
  try {
    if (statusId === 1 || statusId === 3 || statusId === 4 || statusId === 5) {
      return await knex("tickets")
        .where({ id: ticketId })
        .update({ status: statusId, closed: 0 });
    }

    return await knex("tickets")
      .where({ id: ticketId })
      .update({ status: statusId, closed: 1 });
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const UpdateTwoFactorAuth = async ({
  userId,
  twoFactorAuth,
  password,
  confirmPassword,
}) => {
  try {
    if (password !== confirmPassword) {
      throw new Error("Senhas diferentes");
    }
    // SALTEANDO
    // const salt = 1919191919;

    const user = await knex("accounts").where({ id: userId }).first();

    // const combinedData = password + salt;

    // const hashedPassword = crypto
    //   .createHash("sha256")
    //   .update(combinedData)
    //   .digest("hex");

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const isValidPassword = hashedPassword === user.password;
    if (!isValidPassword) {
      throw new Error("Senha invalida");
    }

    const updatedAccount = await knex("accounts").where({ id: userId }).update({
      twoFactorAuth: twoFactorAuth,
    });

    return updatedAccount;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const GetUsers = async () => {
  try {
    const users = await knex("accounts").select("email", "id");
    const streamers = await knex("accounts")
      .select("id", "email")
      .where({ isStreamer: 1 });

    return { users, streamers };
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

export {
  GenerateRecoveryKey,
  GetTickets,
  CreateTicket,
  GetMessageTickets,
  CreateMessagesTicket,
  GetAllTickets,
  UpdateTicketStatus,
  UpdateTwoFactorAuth,
  GetUsers,
};
