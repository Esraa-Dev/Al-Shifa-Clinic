import './i18n';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './index.css'
import App from './App.tsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // تعطيل إعادة الطلب عند العودة للمتصفح
      retry: false, // منع إعادة المحاولة عند الفشل (مهم جداً لحالتك)
      staleTime: 5 * 60 * 1000, // البيانات تبقى صالحة لمدة 5 دقائق
    },
  },
});
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastContainer position="top-right" autoClose={3000} />
      <App />
    </QueryClientProvider>

  </StrictMode>,
)
