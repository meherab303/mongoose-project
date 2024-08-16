import nodemailer from "nodemailer";
import config from "../../app/config";
export const sendEmail = async (receivers: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: config.Node_ENV === "production", // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "meherinhasan191@gmail.com",
      pass: "itpf abji pzzw rvit",
    },
  });
  await transporter.sendMail({
    from: "meherinhasan191@gmail.com", // sender address
    to: receivers, // list of receivers
    subject: "Reset Your Password within Ten minutes", // Subject line
    text: "Hello world?", // plain text body
    html: `${resetLink}`, // html body
  });
};
