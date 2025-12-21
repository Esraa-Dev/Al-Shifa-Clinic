import { UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Banner = () => {
    const navigate = useNavigate();
    return (
        <div className="relative bg-gradient-to-r from-primary to-secondary overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full translate-y-40 -translate-x-40"></div>
            </div>

            <div className="container relative py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="text-white text-right">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            رعاية طبية بجودة عالمية
                        </h1>
                        <p className="text-xl mb-8 opacity-90 leading-relaxed">
                            احجز موعدك مع أفضل الأطباء المتخصصين في مختلف التخصصات الطبية.
                            رعاية صحية شاملة عندما تحتاجها.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button  onClick={() => { navigate("/register"), scrollTo(0, 0) }} className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors cursor-pointer">
                                <UserPlus className="w-5 h-5" />
                                إنشاء حساب
                            </button>
                            <Link to="/appointments/book" className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors">
                                احجز الأن
                            </Link>
                        </div>
                    </div>

                    {/* Right Stats */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white text-center">
                            <div className="text-3xl font-bold mb-2">500+</div>
                            <div className="text-sm opacity-90">طبيب متخصص</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white text-center">
                            <div className="text-3xl font-bold mb-2">50+</div>
                            <div className="text-sm opacity-90">تخصص طبي</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white text-center">
                            <div className="text-3xl font-bold mb-2">24/7</div>
                            <div className="text-sm opacity-90">خدمة متاحة</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white text-center">
                            <div className="text-3xl font-bold mb-2">98%</div>
                            <div className="text-sm opacity-90">رضا العملاء</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;