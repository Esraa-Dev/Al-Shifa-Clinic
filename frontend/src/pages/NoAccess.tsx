const NoAccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute -top-5 -right-5 w-70 h-70 rounded-full bg-primary/5"></div>
      <div className="absolute -bottom-5 -left-5 w-70 h-70 rounded-full bg-secondary/5"></div>
      
      <div className="text-center relative z-10">
        <h1 className="text-9xl font-black text-secondary mb-4">403</h1>
        <h2 className="text-2xl font-medium text-primaryText mb-6">غير مسموح بالوصول</h2>
        <p className="text-gray-600 mb-8">
          ليس لديك صلاحية لعرض هذه الصفحة
        </p>
        <a 
          href="/" 
          className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-primary/90"
        >
          العودة للرئيسية
        </a>
      </div>
    </div>
  );
};
export default NoAccess