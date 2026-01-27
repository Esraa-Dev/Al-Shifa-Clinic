import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./layout/DashboardLayout";
import ContactPage from "./pages/ContactPage";
import MyProfile from "./pages/MyProfile";
import About from "./pages/About";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetOtpVerificationPage from "./pages/ResetOtpVerificationPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import NoAccess from "./pages/NoAccess";
import NotFoundPage from "./pages/NotFoundPage";
import MainLayout from "./layout/MainLayout";
import BookAppointmentPage from "./pages/BookAppointmentPage";
import DoctorOnboarding from "./pages/DoctorOnboarding";
import { AuthProvider } from "./context/AuthContext";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorList from "./pages/DoctorList";
import EmailVerificationPage from './pages/EmailVerificationPage';
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DoctorAppointments from "./pages/DoctorAppointments";
import VideoCallPage from "./pages/VideoCallPage";
import { SocketProvider } from "./context/SocketContext";
import PatientAppointments from "./pages/PatientAppointments";
import IncomingCallModal from "./components/features/book-appointment/IncomingCallModal";
import LanguageHandler from "./components/shared/LanguageHandler";
import DepartmentsPage from "./pages/DepartmentsPage";
import { PaymentSuccess } from "./components/features/book-appointment/PaymentSuccess";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageHandler />
        <SocketProvider>
          <IncomingCallModal />
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/verify-email" element={<EmailVerificationPage />} />
              <Route path="/verify-reset-otp" element={<ResetOtpVerificationPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/doctor/onboarding" element={<DoctorOnboarding />} />
              <Route path="/doctor-list" element={<DoctorList />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
              <Route element={<MainLayout />}>
                <Route path="/profile" element={<MyProfile />} />
                <Route path="/appointments" element={<PatientAppointments />} />
                <Route path="/booking/:id" element={<BookAppointmentPage />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
              <Route path="/doctor" element={<DashboardLayout />}>
                <Route path="dashboard" element={<DoctorDashboard />} />                <Route path="appointments" element={<DoctorAppointments />} />
              </Route>
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["patient", "doctor"]} />}>
              <Route path="/video-call/:roomId" element={<VideoCallPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<DashboardLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
              </Route>
            </Route>

            <Route path="/no-access" element={<NoAccess />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;