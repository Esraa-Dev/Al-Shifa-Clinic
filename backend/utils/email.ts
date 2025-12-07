import nodemailer, { Transporter } from "nodemailer";
import Mailgen from "mailgen";
import dotenv from "dotenv";
dotenv.config();

interface SendEmailOptions {
  email: string;
  subject: string;
  mailgenContent: Mailgen.Content;
}

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "نظام حجز المواعيد الطبية",
    link: process.env.FRONTEND_URL ?? "http://localhost:3000",
    copyright: `جميع الحقوق محفوظة © ${new Date().getFullYear()}`,
  },
  textDirection: "rtl",
});

const transporter: Transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  secure: false,
  auth: {
    user: "2f2bbd62eee820",
    pass: "76172c50e8a8a0",
  },
});

async function sendEmail(options: SendEmailOptions): Promise<void> {
  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHTML = mailGenerator.generate(options.mailgenContent);

  try {
    const info = await transporter.sendMail({
      from: "esraamohammad107@gmail.com",
      to: options.email,
      subject: options.subject,
      text: emailTextual,
      html: emailHTML,
    });
  } catch (error) {
    throw error;
  }
}

const emailVerificationContent = async (
  username: string,
  verificationUrl: string
): Promise<Mailgen.Content> => {
  return {
    body: {
      name: username,
      greeting: "مرحباً",
      signature: "مع خالص التحية",
      intro: `مرحباً ${username}!  
شكرًا لانضمامك إلينا. برجاء تأكيد بريدك الإلكتروني للبدء في استخدام حسابك.`,

      action: {
        instructions: "اضغط على الزر التالي لتأكيد بريدك:",
        button: {
          color: "#2594c9",
          text: "تأكيد البريد الإلكتروني",
          link: verificationUrl,
        },
      },

      outro: "إذا لم تقم بإنشاء حساب، يمكنك تجاهل هذه الرسالة.",
    },
  };
};

const forgotPasswordContent = async (
  username: string,
  resetUrl: string
): Promise<Mailgen.Content> => {
  return {
    body: {
      name: username,
      greeting: "مرحباً",
      signature: "مع خالص التحية",

      intro: `مرحباً ${username}!  
لقد تلقّينا طلبًا لإعادة تعيين كلمة المرور الخاصة بك.`,

      action: {
        instructions: "اضغط على الزر التالي لإعادة تعيين كلمة المرور:",
        button: {
          color: "#2594c9",
          text: "إعادة تعيين كلمة المرور",
          link: resetUrl,
        },
      },

      outro: "إذا لم تطلب إعادة التعيين، يمكنك تجاهل هذه الرسالة.",
    },
  };
};

export { sendEmail, emailVerificationContent, forgotPasswordContent };
