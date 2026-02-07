import { Calendar, Phone } from "lucide-react";
import { Button } from "../../ui/Button";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';


export const Hero = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="relative h-[calc(100vh-96px)] w-full overflow-hidden">
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat bg-[url('/src/assets/hero.jpg')] ${i18n.language === "en" ? "transform-[scaleX(-1)]" : ""}`}
      />

      <div className="relative bg-black/10 w-full h-[calc(100vh-96px)] flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl text-white space-y-6">
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-primary">
              {t('home:hero.title_part1')}
              <span className="text-white me-2"> {t('home:hero.title_part2')}</span>
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
              {t('home:hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
              <Link
                to="/doctor-list"
                className="flex items-center justify-center gap-2 bg-primary px-6 py-3 text-white transition-all hover:bg-primary/80 hover:border hover:border-white w-full sm:w-auto text-center"
              >
                <Calendar className="w-5 h-5" />
                <span className="whitespace-nowrap">{t('home:hero.book_now')}</span>
              </Link>

              <a href="tel:+201234567890" className="w-full sm:w-auto">
                <Button
                  className="flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 hover:border hover:border-white text-white w-full py-3 h-auto"
                >
                  <Phone className="w-5 h-5" />
                  <span className="whitespace-nowrap">{t('home:hero.call_us')}</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
