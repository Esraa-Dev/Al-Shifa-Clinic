import { Routes, Route, BrowserRouter } from "react-router-dom";
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
import MainLayout from "./layout/MainLayout";
import  BookAppointment  from "./pages/BookAppointment";
import PatientOnboarding from "./pages/PatientOnboarding";
import DoctorOnboarding from "./pages/DoctorOnboarding";
// import DoctorDashboard from "./pages/DoctorDashboard";
// import DoctorAppointments from "./pages/DoctorAppointments";
// import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider } from "./context/AuthContext";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorList from "./pages/DoctorList";

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
            <Route path="/reset-password" element={<ResetPasswordForm />} />
            <Route path="/verify-email" element={<EmailVerificationForm />} />
            <Route path="/verify-reset-otp" element={<ResetOtpVerificationPage />} />
            <Route path="/doctors" element={<DoctorPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/doctor/onboarding" element={<DoctorOnboarding />} />
            <Route path="/patient/onboarding" element={<PatientOnboarding />} />
            <Route path="/profile" element={<MyProfile />} />

          </Route>

          <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardOverview />} />
              <Route path="/appointments" element={<MyAppointment />} />
              <Route path="/booking/:id" element={<BookAppointment />} />
              <Route path="/appointments/:docId" element={<Appointment />} />
              <Route path="/doctor-list" element={<DoctorList />} />

            </Route>

          </Route>

          <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              {/* <Route path="/doctor/appointments" element={<DoctorAppointments />} /> */}
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route element={<DashboardLayout />}>
              {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
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