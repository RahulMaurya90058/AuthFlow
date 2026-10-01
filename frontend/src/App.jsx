import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyResetOTP from "./pages/VerifyResetOTP";
import ResetPassword from "./pages/ResetPassword";

import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContactUs from "./pages/ContactUs";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* REGISTER */}
        <Route path="/" element={<Register />} />

        {/* EMAIL VERIFICATION */}
        <Route
          path="/verify-email"
          element={<VerifyEmail />}
        />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* FORGOT PASSWORD */}
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* RESET OTP */}
        <Route
          path="/verify-reset-otp"
          element={<VerifyResetOTP />}
        />

        {/* RESET PASSWORD */}
        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={<Profile />}
        />
 {/* LEGAL */}
        <Route
          path="/terms"
          element={<TermsOfService />}
        />

        <Route
          path="/privacy"
          element={<PrivacyPolicy />}
        />

        {/* CONTACT */}
        <Route
          path="/contact"
          element={<ContactUs />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;