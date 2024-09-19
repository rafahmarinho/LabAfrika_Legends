import { knex } from "@/db/knex";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AuthServices = async ({ name, password }) => {
  try {
    const authConfig = {
      secret: process.env.JWT_SECRET || "mysecret",
      expiresIn: "30d",
    };

    const { expiresIn, secret } = authConfig;

    const user = await knex("accounts").where({ name }).first();

    if (user) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Senha invalida");
      }
      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        secret,
        {
          expiresIn,
        }
      );
      return { token, user };
    } else {
      throw new Error("Usuario não encontrado");
    }
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export { AuthServices };
