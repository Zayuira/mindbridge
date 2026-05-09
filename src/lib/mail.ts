import nodemailer from 'nodemailer';

// Насан туршийн үнэгүй SMTP үйлчилгээ байдаггүй тул Gmail SMTP (эсвэл бусад) ашиглана.
// Хөгжүүлэлтийн явцад EMAIL_USER, EMAIL_PASS байхгүй бол консол дээр хэвлэнэ.

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({ to, subject, body }: { to: string; subject: string; body: string }) {
  // Хэрэв credentials байхгүй бол консол дээр хэвлэж "симуляци" хийнэ
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('--- SIMULATED EMAIL ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    console.log('--------------------------');
    return { success: true, simulated: true };
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Mind Bridge" <noreply@mindbridge.mn>',
      to,
      subject,
      html: body,
    });
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}
