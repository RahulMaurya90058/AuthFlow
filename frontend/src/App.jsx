import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import AccountCreated from "./pages/AccountCreated";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyResetOTP from "./pages/VerifyResetOTP";
import ResetPassword from "./pages/ResetPassword";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/verify-email"
          element={<VerifyEmail />}
        />

        <Route
          path="/account-created"
          element={<AccountCreated />}
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
  path="/verify-reset-otp"
  element={<VerifyResetOTP />}
/>
         <Route
  path="/reset-password"
  element={<ResetPassword />}
/>
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;