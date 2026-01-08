import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import connectToDatabase from '../../utils/dbConnect';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, subject, message } = body;

    if (!name || !phone || !email || !message) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    // Buscar configurações SMTP do banco
    const db = await connectToDatabase();
    const config = await db.collection('config').findOne({ type: 'configuracoes' });

    if (!config || !config.data.smtp) {
      return NextResponse.json({ error: 'Configurações SMTP não encontradas' }, { status: 500 });
    }

    const smtpConfig = config.data.smtp;

    if (!smtpConfig.host || !smtpConfig.user || !smtpConfig.password) {
      return NextResponse.json({ error: 'Configurações SMTP incompletas' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port || 587,
      secure: smtpConfig.secure || false,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.password,
      },
    });

    await transporter.sendMail({
      from: `"${smtpConfig.fromName || name}" <${smtpConfig.fromEmail || smtpConfig.user}>`,
      to: config.data.contato?.email || smtpConfig.user,
      replyTo: email,
      subject: subject || `Nova mensagem de contato - ${name}`,
      text: `Nome: ${name}\nTelefone: ${phone}\nEmail: ${email}\n\nMensagem:\n${message}`,
      html: `<p><strong>Nome:</strong> ${name}</p>
             <p><strong>Telefone:</strong> ${phone}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Assunto:</strong> ${subject || 'Sem assunto'}</p>
             <p><strong>Mensagem:</strong></p>
             <p>${message}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro ao enviar email:', error);
    return NextResponse.json({ error: 'Erro ao enviar email' }, { status: 500 });
  }
}
