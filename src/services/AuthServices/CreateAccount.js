import { knex } from "@/db/knex";
import crypto from "crypto";

const CreateAccount = async ({ nickname, email, password, name }) => {
  try {
    const verifyEmail = await knex("accounts").where({ email }).first();

    if (verifyEmail) {
      throw new Error("Já existe um usuário com este e-mail");
    }

    const verifyNickname = await knex("accounts").where({ name }).first();
    if (verifyNickname) {
      throw new Error("Já existe um usuário com este login");
    }

    if (password.length < 3) {
      throw new Error("Senha muito Curta!");
    }
    if (password.length <= 6) {
      throw new Error("Senha muito fraca!");
    }

    // SALTEANDO o password
    // const salt = 1919191919;

    // const combinedData = password + salt;

    // const hashedPassword = crypto
    //   .createHash("sha256")
    //   .update(combinedData)
    //   .digest("hex");

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const user = await knex("accounts").insert({
      nickname,
      email,
      name,
      password: hashedPassword,
    });

    return user;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export { CreateAccount };
