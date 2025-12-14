const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
            <div className="absolute -top-5 -right-5 w-70 h-70 rounded-full bg-primary/5"></div>
            <div className="absolute -bottom-5 -left-5 w-70 h-70 rounded-full bg-secondary/5"></div>
            <div className="text-center">
                <h1 className="text-9xl font-bold text-secondary mb-4">404</h1>
                <h2 className="text-2xl text-primaryText mb-6">الصفحة غير موجودة</h2>
                <p className="text-gray-600 mb-8">
                    عذراً، الصفحة التي تبحث عنها غير موجودة
                </p>
                <a
                    href="/"
                    className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                    العودة للصفحة الرئيسية
                </a>
            </div>
        </div>
    );
};

export default NotFoundPage;