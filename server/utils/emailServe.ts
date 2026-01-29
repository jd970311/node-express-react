import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// 封装公共发送邮件方法，供外部调用
export interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  from,
}: SendEmailOptions): Promise<void> => {
  const mailOptions = {
    from: from || process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('邮件已发送:', info.response);
  } catch (error) {
    console.error('发送失败:', error);
    throw error;
  }
};
