import { knex } from "@/db/knex";
import crypto from "crypto";

const RecoveryPassword = async ({ name, recoveryKey, password }) => {
  try {
    // const salt = 1919191919;
    const user = await knex("accounts").where({ name }).first();

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (user.key === recoveryKey) {
      // SALTEANDO 
      // const combinedData = password + salt;

      // const hashedPassword = crypto
      //   .createHash("sha256")
      //   .update(combinedData)
      //   .digest("hex");

      const hashedPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

      if (password.length < 3) {
        throw new Error("Senha muito Curta!");
      }
      if (password.length <= 6) {
        throw new Error("Senha muito fraca!");
      }

      await knex("accounts")
        .where({ id: user.id })
        .update({ password: hashedPassword });
      return user;
    } else if (user.key !== recoveryKey) {
      throw new Error("Chave de recuperação inválida");
    }
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export { RecoveryPassword };
