import { useGetDepartment } from "../../hooks/department/useGetDepartment";
import type { Department } from "../../types/types";
import Loading from "../ui/Loading";

const SpecialityMenu = () => {
  const { data: departments, isLoading, isError } = useGetDepartment();
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">فشل في تحميل التخصصات</div>
    );
  }
  console.log(departments);
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full translate-y-40 -translate-x-40"></div>

      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primaryText mb-3">
            التخصصات الطبية
          </h2>
          <p className="text-secondary text-lg mb-4">
            اختر التخصص المناسب لرعايتك الصحية
          </p>
          <div className="w-20 h-1 bg-linear-to-r from-primary to-secondary rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((item: Department) => (
            <div
              key={item._id}
              className="group relative bg-background border border-primaryBorder rounded-2xl p-6 hover:border-primary hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-all duration-500"></div>
              <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="space-y-2">
                  <div className="w-14 h-14 bg-linear-to-br from-primary to-secondary rounded-2xl flex-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={"/src/assets/icons/headset.svg"}
                      alt={item.name}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-primaryText group-hover:text-primary transition-colors duration-300">
                    {item.name}
                  </h3>
                  <p className="text-secondary text-sm font-medium">
                    {item.doctorsCount} طبيب متخصص
                  </p>
                  <p className="text-primaryText/70 text-sm mt-2 leading-relaxed">
                    رعاية طبية متكاملة في تخصص {item.name} مع أفضل الأطباء
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialityMenu;
