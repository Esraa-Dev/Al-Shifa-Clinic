import nodemailer, { Transporter } from "nodemailer";
import Mailgen from "mailgen";
import dotenv from "dotenv";
import i18n from "../config/i18n.js";

dotenv.config();

interface SendEmailOptions {
  email: string;
  subject: string;
  mailgenContent: Mailgen.Content;
  language?: string;
}

const createMailGenerator = (language: string = 'en') => {
  const t = i18n.getFixedT(language, 'email');
  const isArabic = language === 'ar';
  
  return new Mailgen({
    theme: "default",
    product: {
      name: t('product.name'),
      link: process.env.FRONTEND_URL ?? "http://localhost:5173",
      copyright: t('product.copyright', { year: new Date().getFullYear() }),
    },
    textDirection: isArabic ? "rtl" : "ltr",
  });
};

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
  const mailGenerator = createMailGenerator(options.language);
  
  try {
    const info = await transporter.sendMail({
      from: "esraamohammad107@gmail.com",
      to: options.email,
      subject: options.subject,
      text: mailGenerator.generatePlaintext(options.mailgenContent),
      html: mailGenerator.generate(options.mailgenContent),
    });
  } catch (error) {
    throw error;
  }
}

const emailVerificationContent = async (
  username: string,
  otp: string,
  language: string = 'en'
): Promise<Mailgen.Content> => {
  const t = i18n.getFixedT(language, 'email');
  
  return {
    body: {
      name: username,
      greeting: t('verification.greeting'),
      signature: t('verification.signature'),
      intro: t('verification.intro', { username, otp }),
      outro: t('verification.outro'),
    },
  };
};

const forgotPasswordContent = async (
  username: string,
  otp: string,
  language: string = 'en'
): Promise<Mailgen.Content> => {
  const t = i18n.getFixedT(language, 'email');
  
  return {
    body: {
      name: username,
      greeting: t('resetPassword.greeting'),
      signature: t('resetPassword.signature'),
      intro: t('resetPassword.intro', { username, otp }),
      outro: t('resetPassword.outro'),
    },
  };
};

const contactMessageContent = async (
  name: string,
  email: string,
  phone: string,
  subject: string,
  message: string,
  language: string = 'en'
): Promise<Mailgen.Content> => {
  const t = i18n.getFixedT(language, 'email');
  
  return {
    body: {
      name: name,
      greeting: t('contact.greeting'),
      signature: t('contact.signature'),
      intro: t('contact.intro'),
      action: {
        instructions: t('contact.instructions'),
        button: {
          color: '#007bff',
          text: t('contact.viewMessage'),
          link: `${process.env.ADMIN_DASHBOARD_URL || process.env.FRONTEND_URL}/admin/contacts`
        }
      },
      table: {
        data: [
          { key: t('contact.name'), value: name },
          { key: t('contact.email'), value: email },
          { key: t('contact.phone'), value: phone },
          { key: t('contact.subject'), value: subject },
          { key: t('contact.message'), value: message }
        ]
      },
      outro: t('contact.outro')
    }
  };
};

const contactConfirmationContent = async (
  name: string,
  language: string = 'en'
): Promise<Mailgen.Content> => {
  const t = i18n.getFixedT(language, 'email');
  
  return {
    body: {
      name: name,
      greeting: t('contactConfirmation.greeting'),
      signature: t('contactConfirmation.signature'),
      intro: t('contactConfirmation.intro'),
      outro: t('contactConfirmation.outro', { 
        phone: process.env.SUPPORT_PHONE || '+1234567890',
        email: process.env.SUPPORT_EMAIL || 'support@example.com'
      })
    }
  };
};

export { 
  sendEmail, 
  emailVerificationContent, 
  forgotPasswordContent,
  contactMessageContent,
  contactConfirmationContent 
};