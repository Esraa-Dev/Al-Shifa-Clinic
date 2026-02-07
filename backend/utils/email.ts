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
      link: process.env.FRONTEND_URL || "http://localhost:5173",
      copyright: t('product.copyright', { year: new Date().getFullYear() }),
      logo: "https://res.cloudinary.com/dajioti7d/image/upload/v1770423781/logo_rl6eup.png",
      logoHeight: "100px"
    },
    textDirection: isArabic ? "rtl" : "ltr",
  });
};

const transporter: Transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
  port: parseInt(process.env.SMTP_PORT || "2525"),
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME || "2f2bbd62eee820",
    pass: process.env.SMTP_PASSWORD || "76172c50e8a8a0",
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function sendEmail(options: SendEmailOptions): Promise<void> {
  const mailGenerator = createMailGenerator(options.language);
  
  try {
    const info = await transporter.sendMail({
      from: `"Al Shifa Clinic" <${process.env.SENDER_EMAIL || 'esraamohmmad107@gmail.com'}>`,
      to: options.email,
      subject: options.subject,
      text: mailGenerator.generatePlaintext(options.mailgenContent),
      html: mailGenerator.generate(options.mailgenContent),
    });
    
    console.log(`Email sent to ${options.email}: ${info.messageId}`);
  } catch (error: any) {
    console.error('Email sending failed:', {
      to: options.email,
      error: error.message,
      code: error.code
    });
    throw new Error(`Failed to send email: ${error.message}`);
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
      greeting: t('verification.greeting', { username }),
      signature: t('verification.signature'),
      intro: t('verification.intro', { otp }),
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
      greeting: t('resetPassword.greeting', { username }),
      signature: t('resetPassword.signature'),
      intro: t('resetPassword.intro', { otp }),
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
      name: "Admin",
      greeting: t('contact.greeting'),
      signature: t('contact.signature'),
      intro: t('contact.intro'),
      action: {
        instructions: t('contact.instructions'),
        button: {
          color: '#2594c9',
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
      greeting: t('contactConfirmation.greeting', { name }),
      signature: t('contactConfirmation.signature'),
      intro: t('contactConfirmation.intro'),
      outro: t('contactConfirmation.outro', { 
        phone: process.env.SUPPORT_PHONE || '+1234567890',
        email: process.env.SUPPORT_EMAIL || 'support@alshifaclinic.com'
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
      greeting: t('appointmentConfirmation.greeting', { patientName }),
      signature: t('appointmentConfirmation.signature'),
      intro: t('appointmentConfirmation.intro'),
      action: {
        instructions: t('appointmentConfirmation.details'),
        button: {
          color: '#ed7b21',
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
      greeting: t('appointmentReminder.greeting', { patientName }),
      signature: t('appointmentReminder.signature'),
      intro: t('appointmentReminder.intro'),
      action: {
        instructions: t('appointmentReminder.details'),
        button: {
          color: '#ed7b21',
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