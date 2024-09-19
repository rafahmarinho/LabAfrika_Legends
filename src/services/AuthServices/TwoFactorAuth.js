import { knex } from "@/db/knex";
import nodemailer from "nodemailer";
const jwt = require("jsonwebtoken");

function generateRandomCode() {
  const randomCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

  return randomCode;
}

const TwoFactorAuth = async ({ user }) => {
  try {
    const code = generateRandomCode();
    const data = {
      host: process.env.EMAIL_SERVER,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === "true" ? true : false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    };

    await knex("VerifyCode").insert({
      code: code,
      accountId: user.id,
    });

    const transporter = nodemailer.createTransport(data);

    const mailOptions = {
      from: {
        address: data.auth.user,
        name: "Legends of Unknown",
      },
      to: user.email.toLowerCase(),
      subject: "Verificação em duas etapas",
      text: `Código: ${code}`,
    };
    await transporter.sendMail(mailOptions);
    return code;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const TwoFactorAuthLogin = async ({ code }) => {
  try {
    const authConfig = {
      secret: process.env.JWT_SECRET || "mysecret",
      expiresIn: "30d",
    };

    const { expiresIn, secret } = authConfig;

    const verifyCode = await knex("VerifyCode").where({ code: code }).first();
    if (!verifyCode) {
      throw new Error("Código inválido!");
    }

    const user = await knex("accounts")
      .where({ id: verifyCode.accountId })
      .first();

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      secret,
      {
        expiresIn,
      }
    );

    await knex("VerifyCode").where({ code: code }).delete();

    return { token, user };
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export { TwoFactorAuth, TwoFactorAuthLogin };
