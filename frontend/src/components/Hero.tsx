import { Calendar, Phone } from "lucide-react";
import { Button } from "./ui/Button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="h-[calc(100vh-96px)] w-full bg-cover bg-center bg-no-repeat bg-[url('/src/assets/hero.jpg')]">
      <div className="bg-black/50 w-full h-[calc(100vh-96px)] flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl text-white space-y-6">
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-primary">
              صحتك
              <span className="text-white me-2"> أولويتنا</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
              نحن نقدم أفضل الخدمات الطبية مع فريق متخصص لضمان راحتك وصحتك على
              أعلى مستوى.{" "}
            </p>

            <div className="flex gap-4 mt-6">
              <Link to="/appointments/book" className="flex items-center gap-2 bg-primary px-6 py-2 text-white hover:bg-primary/80 hover:border hover:border-white">
                <Calendar className="w-5 h-5" /> احجز موعدك الآن
              </Link>

              <Button className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 hover:border hover:border-white text-white ">
                <Phone className="w-5 h-5" /> اتصل بنا
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
