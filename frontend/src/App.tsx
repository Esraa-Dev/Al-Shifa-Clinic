import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Navbar } from "./layout/Navbar";
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
import ForgotPasswordForm from "./components/forms/ForgotPasswordForm";
import EmailVerificationForm from "./components/forms/EmailVerificationForm";
import ResetPasswordForm from "./components/forms/ResetPasswordForm";
import RegisterPage from "./pages/RegisterPage";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Website */}
        <Route path="/" element={<HomePage />} />
        <Route path="/doctors" element={<DoctorPage />} />
        <Route path="/doctors/:specialty" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={<MyProfile />} />

        <Route path="/appointments" element={<MyAppointment />} />
        <Route path="/appointments/:docId" element={<Appointment />} />
        {/* <Route path="/departments" element={<LoginPage />} /> */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/verify-email" element={<EmailVerificationForm />} />
        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
