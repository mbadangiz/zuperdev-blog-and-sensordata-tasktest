import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string, html?: string) {
    try {
      const mailOptions = {
        from: process.env.MAIL_FROM,
        to: to,
        subject,
        text,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      return error;
    }
  }
}
