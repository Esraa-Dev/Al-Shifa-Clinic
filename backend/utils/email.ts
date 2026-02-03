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
    theme: "salted",
    product: {
      name: t('product.name'),
      link: process.env.FRONTEND_URL ?? "https://alshifaclinic.com",
      copyright: t('product.copyright', { year: new Date().getFullYear() }),
      logo: "/frontend/public/logo.svg",
      logoHeight: "50px"
    },
    textDirection: isArabic ? "rtl" : "ltr",
  });
};

const transporter: Transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function sendEmail(options: SendEmailOptions): Promise<void> {
  const mailGenerator = createMailGenerator(options.language);
  
  try {
    const info = await transporter.sendMail({
      from: `"Al Shifa Clinic" <${process.env.FROM_EMAIL}>`,
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
      action: {
        instructions: t('verification.instructions'),
        button: {
          color: '#22c55e',
          text: t('verification.verifyButton'),
          link: `${process.env.FRONTEND_URL}/verify-email?otp=${otp}`
        }
      },
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
      action: {
        instructions: t('resetPassword.instructions'),
        button: {
          color: '#3b82f6',
          text: t('resetPassword.resetButton'),
          link: `${process.env.FRONTEND_URL}/reset-password?otp=${otp}`
        }
      },
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
          link: `${process.env.ADMIN_DASHBOARD_URL}/admin/contacts`
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
        phone: process.env.SUPPORT_PHONE,
        email: process.env.SUPPORT_EMAIL
      })
    }
  };
};

const appointmentConfirmationContent = async (
  patientName: string,
  doctorName: string,
  date: string,
  time: string,
  type: string,
  location: string,
  fee: string,
  language: string = 'en'
): Promise<Mailgen.Content> => {
  const t = i18n.getFixedT(language, 'email');
  
  return {
    body: {
      name: patientName,
      greeting: t('appointmentConfirmation.greeting'),
      signature: t('appointmentConfirmation.signature'),
      intro: t('appointmentConfirmation.intro'),
      action: {
        instructions: t('appointmentConfirmation.details'),
        button: {
          color: '#10b981',
          text: t('appointmentConfirmation.viewAppointment'),
          link: `${process.env.FRONTEND_URL}/appointments`
        }
      },
      table: {
        data: [
          { key: t('appointmentConfirmation.doctor'), value: doctorName },
          { key: t('appointmentConfirmation.date'), value: date },
          { key: t('appointmentConfirmation.time'), value: time },
          { key: t('appointmentConfirmation.type'), value: type },
          { key: t('appointmentConfirmation.location'), value: location },
          { key: t('appointmentConfirmation.fee'), value: fee }
        ]
      },
      outro: t('appointmentConfirmation.outro')
    }
  };
};

const appointmentReminderContent = async (
  patientName: string,
  doctorName: string,
  date: string,
  time: string,
  type: string,
  location: string,
  language: string = 'en'
): Promise<Mailgen.Content> => {
  const t = i18n.getFixedT(language, 'email');
  
  return {
    body: {
      name: patientName,
      greeting: t('appointmentReminder.greeting'),
      signature: t('appointmentReminder.signature'),
      intro: t('appointmentReminder.intro'),
      action: {
        instructions: t('appointmentReminder.details'),
        button: {
          color: '#f59e0b',
          text: t('appointmentReminder.confirmAttendance'),
          link: `${process.env.FRONTEND_URL}/appointments`
        }
      },
      table: {
        data: [
          { key: t('appointmentReminder.doctor'), value: doctorName },
          { key: t('appointmentReminder.date'), value: date },
          { key: t('appointmentReminder.time'), value: time },
          { key: t('appointmentReminder.type'), value: type },
          { key: t('appointmentReminder.location'), value: location }
        ]
      },
      outro: t('appointmentReminder.outro')
    }
  };
};

export { 
  sendEmail, 
  emailVerificationContent, 
  forgotPasswordContent,
  contactMessageContent,
  contactConfirmationContent,
  appointmentConfirmationContent,
  appointmentReminderContent
};