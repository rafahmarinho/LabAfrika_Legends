import { knex } from "@/db/knex";
import crypto from "crypto";

const ChangePassword = async ({ oldPassword, newPassword, userId }) => {
  try {
    // Para utilizar o SALT
    // const salt = 1919191919;

    const user = await knex("accounts")
      .where({ id: Number(userId) })
      .first();

    // SALT na senha antiga
      // const combinedOldData = oldPassword + salt;

    // const hashedOldPassword = crypto
    //   .createHash("sha256")
    //   .update(combinedOldData)
    //   .digest("hex");

    // const isValidPassword = hashedOldPassword === user.password;
    const isValidPassword = oldPassword === user.password;
    if (!isValidPassword) {
      throw new Error("Senha antiga inválida");
    }

    // SALT na senha nova
    // const combinedNewData = newPassword + salt;

    // const hashedNewPassword = crypto
    //   .createHash("sha256")
    //   .update(combinedNewData)
    //   .digest("hex");
    
    const hashedNewPassword = crypto
      .createHash("sha256")
      .update(newPassword)
      .digest("hex");

    if (newPassword.length < 3) {
      throw new Error("Nova senha muito curta!");
    }
    if (newPassword.length <= 6) {
      throw new Error("Nova senha muito fraca!");
    }

    return await knex("accounts")
      .where({ id: userId })
      .update({ password: hashedNewPassword });
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export { ChangePassword };
