import { Heart, Users, Shield, Award, Target, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation('about');

  const values = [
    {
      icon: <Heart className="w-6 h-6 md:w-8 md:h-8" />,
      title: t('values.healthFirst.title'),
      description: t('values.healthFirst.description')
    },
    {
      icon: <Shield className="w-6 h-6 md:w-8 md:h-8" />,
      title: t('values.privacySecurity.title'),
      description: t('values.privacySecurity.description')
    },
    {
      icon: <Users className="w-6 h-6 md:w-8 md:h-8" />,
      title: t('values.teamwork.title'),
      description: t('values.teamwork.description')
    },
    {
      icon: <Award className="w-6 h-6 md:w-8 md:h-8" />,
      title: t('values.highQuality.title'),
      description: t('values.highQuality.description')
    }
  ];

  const stats = [
    { number: "500+", label: t('stats.specializedDoctors') },
    { number: "50k+", label: t('stats.satisfiedPatients') },
    { number: "24/7", label: t('stats.technicalSupport') },
    { number: "98%", label: t('stats.customerSatisfaction') }
  ];

  return (
    <div className="bg-background">
      <section className="py-12 md:py-20 bg-linear-to-r from-primary to-secondary text-white">
        <div className="container">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-center">
            {t('heroTitle')}
          </h1>
          <p className="text-base md:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed text-center">
            {t('heroDescription')}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-primaryBorder h-full">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <Target className="w-8 h-8 md:w-10 md:h-10 text-primary shrink-0" />
                <h2 className="text-xl md:text-2xl font-bold text-primaryText">{t('missionTitle')}</h2>
              </div>
              <p className="text-secondary text-base md:text-lg leading-relaxed">
                {t('missionDescription')}
              </p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-primaryBorder h-full">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <Globe className="w-8 h-8 md:w-10 md:h-10 text-primary shrink-0" />
                <h2 className="text-xl md:text-2xl font-bold text-primaryText">{t('visionTitle')}</h2>
              </div>
              <p className="text-secondary text-base md:text-lg leading-relaxed">
                {t('visionDescription')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-white">
        <div className="container">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-primaryText mb-3 md:mb-4">{t('valuesTitle')}</h2>
            <p className="text-secondary text-base md:text-xl">{t('valuesSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-background rounded-2xl border border-primaryBorder flex flex-col items-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 md:mb-6 shrink-0">
                  {value.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-primaryText mb-2 md:mb-3">{value.title}</h3>
                <p className="text-secondary text-sm md:text-base leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-linear-to-r from-primary to-secondary">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 md:mb-2">{stat.number}</div>
                <div className="text-sm sm:text-base text-white/90 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;