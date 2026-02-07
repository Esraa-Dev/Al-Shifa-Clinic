import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import App from './App.tsx';
import './i18n';
import './index.css';
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const Root = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position={isRTL ? "top-right" : "top-left"}
        rtl={isRTL}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <App />
    </QueryClientProvider>
  );
};

createRoot(document.getElementById('root')!).render(
    <Root />
);