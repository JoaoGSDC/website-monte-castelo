'use server';

import nodemailer from 'nodemailer';

export async function sendEmail(formData: FormData) {
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"${name}" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER,
    replyTo: email,
    subject: subject || `Nova mensagem de contato - ${name}`,
    text: `Nome: ${name}\nTelefone: ${phone}\nEmail: ${email}\n\nMensagem:\n${message}`,
    html: `<p><strong>Nome:</strong> ${name}</p>
           <p><strong>Telefone:</strong> ${phone}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Assunto:</strong> ${subject}</p>
           <p><strong>Mensagem:</strong></p>
           <p>${message}</p>`,
  });
}
