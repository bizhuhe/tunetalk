import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  async sendEmail(recipient: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      ignoreTLS: true,
    });

    const mailOptions = {
      from: 'bizhu.he@axleinfo.com',
      to: recipient,
      subject,
      text,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.response);
    } catch (error) {
      console.error('Error occurred while sending email:', error);
      throw error;
    }
  }
}
