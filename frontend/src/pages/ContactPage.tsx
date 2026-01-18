import { Phone, Mail, MapPin, Clock, MessageSquare, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../components/ui/Button";
import { TextInput } from "../components/ui/TextInput";
import { Textarea } from "../components/ui/Textarea";
import { useTranslation } from "react-i18next";
import { contactSchema, type ContactFormData } from "../validations/contactSchema";
import { useSendMessage } from "../hooks/contact/useSendMessage";
import { ContactFaq } from "../components/features/contact/ContactFaq";
import { ContactInfo } from "../components/features/contact/ContactInfo";

const ContactPage = () => {
  const { t } = useTranslation('contact');
  const { t: tNav } = useTranslation('nav');
  const { mutate, isPending } = useSendMessage();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    mutate(data, {
      onSuccess: () => {
        reset();
      }
    })
  }

  const contactMethods = [
    {
      icon: Phone,
      title: t('phone.title'),
      details: t('phone.details'),
      description: t('phone.description')
    },
    {
      icon: Mail,
      title: t('email.title'),
      details: t('email.details'),
      description: t('email.description')
    },
    {
      icon: MapPin,
      title: t('address.title'),
      details: t('address.details'),
      description: t('address.description')
    },
    {
      icon: Clock,
      title: t('hours.title'),
      details: t('hours.details'),
      description: t('hours.description')
    }
  ].map(method => ({
    icon: <method.icon className="w-6 h-6" />,
    title: method.title,
    details: method.details,
    description: method.description
  }));

  const faqs = [
    {
      question: t('faq.booking.question'),
      answer: t('faq.booking.answer')
    },
    {
      question: t('faq.availability.question'),
      answer: t('faq.availability.answer')
    },
    {
      question: t('faq.cancellation.question'),
      answer: t('faq.cancellation.answer')
    },
    {
      question: t('faq.support.question'),
      answer: t('faq.support.answer')
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <section className="py-20 bg-linear-to-r from-primary to-secondary text-white">
        <div className="container text-center">
          <h1 className="text-5xl font-bold mb-6">{tNav('contact') || t('pageTitle')}</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">{t('heroDescription')}</p>
        </div>
      </section>

      <div className="container py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-2xl border border-primaryBorder shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <MessageSquare className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-primaryText">{t('form.title')}</h2>
            </div>


            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput
                  id="fullName"
                  label={t('form.fullName.label')}
                  placeholder={t('form.fullName.placeholder')}
                  register={register("name")}
                  error={errors.name}
                  requiredInput
                />
                <TextInput
                  id="email"
                  label={t('form.email.label')}
                  type="email"
                  placeholder={t('form.email.placeholder')}
                  register={register("email")}
                  error={errors.email}
                  requiredInput
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput
                  id="phone"
                  label={t('form.phone.label')}
                  type="tel"
                  placeholder={t('form.phone.placeholder')}
                  register={register("phone")}
                  error={errors.phone}
                  requiredInput
                />
                <TextInput
                  id="subject"
                  label={t('form.subject.label')}
                  placeholder={t('form.subject.placeholder')}
                  register={register("subject")}
                  error={errors.subject}
                  requiredInput
                />
              </div>

              <Textarea
                id="message"
                label={t('form.message.label')}
                placeholder={t('form.message.placeholder')}
                register={register("message")}
                error={errors.message}
                rows={5}
                requiredInput
              />

              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="animate-pulse">{t('form.sending')}</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {t('form.submit')}
                  </>
                )}
              </Button>
            </form>
          </div>

          <div>
            <ContactInfo
              methods={contactMethods}
              title={t('info.title')}
              description={t('info.description')}
            />
            <ContactFaq
              faqs={faqs}
              title={t('faq.title')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;