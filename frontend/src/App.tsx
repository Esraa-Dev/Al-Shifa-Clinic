import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./layout/DashboardLayout";
import ContactPage from "./pages/ContactPage";
import MyAppointment from "./pages/MyAppointment";
import Appointment from "./pages/Appointment";
import DoctorPage from "./pages/DoctorPage";
import MyProfile from "./pages/MyProfile";
import About from "./pages/About";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetOtpVerificationPage from "./pages/ResetOtpVerificationPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import NoAccess from "./pages/NoAccess";
import NotFoundPage from "./pages/NotFoundPage";
import MainLayout from "./layout/MainLayout";
import BookAppointment from "./pages/BookAppointment";
import DoctorOnboarding from "./pages/DoctorOnboarding";;
import { AuthProvider } from "./context/AuthContext";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorList from "./pages/DoctorList";
import EmailVerificationPage from './pages/EmailVerificationPage';
import ResetPasswordPage from "./pages/ResetPasswordPage";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<EmailVerificationPage />} />
            <Route path="/verify-reset-otp" element={<ResetOtpVerificationPage />} />
            <Route path="/doctors" element={<DoctorPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/doctor/onboarding" element={<DoctorOnboarding />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
            <Route element={<MainLayout />}>
              <Route path="/profile" element={<MyProfile />} />
              <Route path="/appointments" element={<MyAppointment />} />
              <Route path="/booking/:id" element={<BookAppointment />} />
              <Route path="/appointments/:docId" element={<Appointment />} />
              <Route path="/doctor-list" element={<DoctorList />} />
            </Route>

          </Route>

          <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route element={<DashboardLayout />}>
            </Route>
          </Route>

          <Route path="/no-access" element={<NoAccess />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;