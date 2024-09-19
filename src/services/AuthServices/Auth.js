import { knex } from "@/db/knex";
const jwt = require("jsonwebtoken");
import { TwoFactorAuth } from "./TwoFactorAuth";
import crypto from "crypto";

const AuthServices = async ({ name, password }) => {
  try {
    const authConfig = {
      secret: process.env.JWT_SECRET || "mysecret",
      expiresIn: "30d",
    };

    const { expiresIn, secret } = authConfig;

    const user = await knex("accounts").where({ name }).first();
    if (!user) {
      throw new Error("Os dados informados estão incorretos ou não constam em nossa base!");
    }
    //  Para utilizar o SALT
    // const salt = 1919191919;
    // const combinedData = password + salt;

    // const hash = crypto.createHash("sha256").update(combinedData).digest("hex");

    const hash = crypto.createHash('sha256').update(password).digest('hex');
    const isValidPassword = hash === user.password;
    if (!isValidPassword) {
      throw new Error("Os dados informados estão incorretos ou não constam em nossa base!");
    }

    if (user.twoFactorAuth === 1) {
      await TwoFactorAuth({ user: user });
      return { twoFactorAuth: true };
    }
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      secret,
      {
        expiresIn,
      }
    );

    return { token, user };
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export { AuthServices };
