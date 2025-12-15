import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Footer } from "./layout/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./layout/DashboardLayout";
import DashboardOverview from "./pages/DashboardOverview";
import ContactPage from "./pages/ContactPage";
import MyAppointment from "./pages/MyAppointment";
import Appointment from "./pages/Appointment";
import DoctorPage from "./pages/DoctorPage";
import MyProfile from "./pages/MyProfile";
import About from "./pages/About";
import EmailVerificationForm from "./components/forms/EmailVerificationForm";
import ResetPasswordForm from "./components/forms/ResetPasswordForm";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetOtpVerificationPage from "./pages/ResetOtpVerificationPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import NoAccess from "./pages/NoAccess";
import NotFoundPage from "./pages/NotFoundPage";
import PublicRoute from "./routes/PublicRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route path="/verify-email" element={<EmailVerificationForm />} />
          <Route path="/verify-reset-otp" element={<ResetOtpVerificationPage />} />
          <Route path="/doctors" element={<DoctorPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/no-access" element={<NoAccess />} />
          <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/appointments" element={<MyAppointment />} />
            <Route path="/appointments/:docId" element={<Appointment />} />
          </Route>
        </Route>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
