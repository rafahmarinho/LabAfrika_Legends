import { knex } from "@/db/knex";
const { verify } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

const RefreshToken = async ({ tokenNumber }) => {
  try {
    const authConfig = {
      secret: process.env.JWT_SECRET || "mysecret",
      expiresIn: "30d",
    };

    const { expiresIn, secret } = authConfig;

    const decoded = verify(tokenNumber, authConfig.secret);

    const { id, email } = decoded;

    const user = await knex("accounts").where({ id, email: email }).first();

    if (user) {
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
    throw err;
  }
};

export { RefreshToken };
