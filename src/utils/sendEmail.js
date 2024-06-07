import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const sendEmail = async ({ user, emailType }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      auth: {
        user: process.env.SEND_EMAIL,
        pass: process.env.PASS_KEY,
      },
    });
    const salt = await bcrypt.genSalt(10);
    let encryptedTokenMain = await bcrypt.hash(user.id.toString(), salt);
    let encryptedToken = "";

    for (var i = 0; i < encryptedTokenMain.length; i++) {
      if (encryptedTokenMain[i] !== "/") {
        encryptedToken += encryptedTokenMain[i];
      } else {
        continue;
      }
    }

    await prisma.token.create({
      data: {
        token: encryptedToken,
        userId: user.id,
      },
    });

    let emailContent = "";
    let mailOptions = {};

    if (emailType == "verifyemail") {
      emailContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f8f8f8">
      <div
        style="
          background: #3cbd7d;
          width: 100;
          padding: 3rem;
          border-radius: 5px 5px 0px 0px;
          text-align: center;
        "
      >
        <h1 style="color: #fff; letter-spacing: 0.2rem; font-size: 2rem">
          Expense Tracker 💰
        </h1>
      </div>
      <div style="background-color: #ffffff; padding: 20px; border-radius: 5px">
        <p style="text-align: center">Hi ${user.name},</p>
        <h1 style="text-align: center; color: #333">
          Verify Your Email Address
        </h1>
        <p style="text-align: center; color: #333">
          Please click on the button below to verify your email address.
        </p>
        <div style="text-align: center">
          <a
            href="https://magic-link-verification.vercel.app/verifyemail/${encryptedToken}"
            style="
              display: inline-block;
              padding: 16px 50px;
              background-color: #3cbd7d;
              color: #ffffff;
              text-decoration: none;
              border-radius: 50px;
              margin-top: 2rem;
            "
          >
            Verify Email
          </a>

          <p style="color: #333; margin-top: 2rem">
            If you did not create an account, no further action is required.
          </p>

          <p style="color: #333">
            Regards,
            <br />
          </p>
        </div>
      </div>
    </div>
        `;

      mailOptions = {
        from: process.env.SEND_EMAIL,
        to: user.email,
        subject: "Verify Your Email Address",
        html: emailContent,
      };
    } else {
      emailContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f8f8f8">
      <div
        style="
          background: #3cbd7d;
          width: 100;
          padding: 3rem;
          border-radius: 5px 5px 0px 0px;
          text-align: center;
        "
      >
        <h1 style="color: #fff; letter-spacing: 0.2rem; font-size: 2rem">
          Expense Tracker 💰
        </h1>
      </div>
      <div style="background-color: #ffffff; padding: 20px; border-radius: 5px">
        <p style="text-align: center">Hi ${user.name},</p>
        <h1 style="text-align: center; color: #333">
          Reset Your Password
        </h1>
        <p style="text-align: center; color: #333">
          Please click on the button below to reset your password.
        </p>
        <div style="text-align: center">
          <a
            href="
            https://magic-link-verification.vercel.app/${encryptedToken}
                      "
            style="
              display: inline-block;
              padding: 16px 50px;
              background-color: #3cbd7d;
              color: #ffffff;
              text-decoration: none;
              border-radius: 50px;
              margin-top: 2rem;
            "
          >
            Reset Password
          </a>

          <p style="color: #333; margin-top: 2rem">
            If you did not create an account, no further action is required.
          </p>

          <p style="color: #333">
            Regards,
            <br />
          </p>
        </div>
      </div>`;
      mailOptions = {
        from: process.env.SEND_EMAIL,
        to: user.email,
        subject: "Reset Your Password",
        html: emailContent,
      };
    }

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

export { sendEmail };
