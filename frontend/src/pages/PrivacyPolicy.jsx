import { Link } from "react-router-dom";
import {
  ArrowLeft,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Back */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-600"
        >
          <ArrowLeft size={18} />
          Back to Sign Up
        </Link>

        {/* Header */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 p-8 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
              <LockKeyhole size={26} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Privacy Policy
              </h1>

              <p className="mt-1 text-sm text-white/80">
                How AuthFlow handles your information
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Notice */}
          <div className="mb-8 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex gap-3">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-emerald-600"
              />

              <p className="text-sm leading-6 text-emerald-800">
                This Privacy Policy explains what information
                AuthFlow may collect, how it is used, and the
                choices available to users.
              </p>
            </div>
          </div>

          {/* 1 */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              1. Information We Collect
            </h2>

            <p className="mb-3 text-sm leading-7 text-slate-600">
              When you create or use an AuthFlow account, we
              may collect information necessary to provide
              authentication services.
            </p>

            <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
              <li>Name</li>
              <li>Email address</li>
              <li>Password information</li>
              <li>Profile picture, when provided</li>
              <li>Authentication provider information</li>
              <li>Account creation and update timestamps</li>
            </ul>
          </section>

          {/* 2 */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              2. Google Sign-In Information
            </h2>

            <p className="text-sm leading-7 text-slate-600">
              If you use Google Sign-In, AuthFlow may receive
              information provided by Google, such as your
              Google account email address, name, profile
              picture, and Google account identifier.
            </p>
          </section>

          {/* 3 */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              3. How We Use Your Information
            </h2>

            <p className="mb-3 text-sm leading-7 text-slate-600">
              Information collected by AuthFlow may be used
              to:
            </p>

            <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
              <li>Create and manage your account.</li>
              <li>Authenticate your identity.</li>
              <li>Verify your email address.</li>
              <li>Send verification and password-reset codes.</li>
              <li>Provide password recovery functionality.</li>
              <li>Maintain account security.</li>
              <li>Improve and maintain the authentication service.</li>
            </ul>
          </section>

          {/* 4 */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              4. Password Protection
            </h2>

            <p className="text-sm leading-7 text-slate-600">
              AuthFlow does not store your password as plain
              text. Passwords are processed using secure
              password hashing before being stored.
            </p>
          </section>

          {/* 5 */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              5. Authentication Cookies
            </h2>

            <p className="text-sm leading-7 text-slate-600">
              AuthFlow uses authentication cookies to maintain
              your signed-in session. Authentication tokens may
              be stored in HTTP-only cookies to reduce exposure
              to client-side scripts.
            </p>
          </section>

          {/* 6 */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              6. Email Communication
            </h2>

            <p className="text-sm leading-7 text-slate-600">
              AuthFlow may send transactional emails such as
              account verification codes and password-reset
              codes. These communications are necessary for
              certain authentication features.
            </p>
          </section>

          {/* 7 */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              7. Third-Party Services
            </h2>

            <p className="mb-3 text-sm leading-7 text-slate-600">
              AuthFlow may use third-party services to provide
              specific functionality, including:
            </p>

            <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
              <li>
                Google for Google authentication.
              </li>

              <li>
                Brevo for transactional email delivery.
              </li>

              <li>
                MongoDB for application data storage.
              </li>
            </ul>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              These services may process information according
              to their own privacy policies and terms.
            </p>
          </section>

          {/* 8 */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              8. Information Sharing
            </h2>

            <p className="text-sm leading-7 text-slate-600">
              AuthFlow does not intend to sell your personal
              information. Information may be processed by
              service providers when necessary to operate
              authentication, storage, email, or other
              application functionality.
            </p>
          </section>

          {/* 9 */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              9. Data Security
            </h2>

            <p className="text-sm leading-7 text-slate-600">
              AuthFlow uses reasonable technical measures
              intended to protect account information from
              unauthorized access, alteration, or disclosure.
              However, no internet-based system can guarantee
              absolute security.
            </p>
          </section>

          {/* 10 */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              10. Account Deletion
            </h2>

            <p className="text-sm leading-7 text-slate-600">
              You may be able to request deletion of your
              AuthFlow account depending on the features
              available in your application. Account deletion
              may remove information associated with your
              account, subject to applicable legal or
              operational requirements.
            </p>
          </section>

          {/* 11 */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              11. Children's Privacy
            </h2>

            <p className="text-sm leading-7 text-slate-600">
              AuthFlow is not intentionally designed to collect
              personal information from children in violation
              of applicable laws. If you believe a child has
              provided personal information improperly, contact
              the service administrator.
            </p>
          </section>

          {/* 12 */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              12. Changes to This Privacy Policy
            </h2>

            <p className="text-sm leading-7 text-slate-600">
              This Privacy Policy may be updated when AuthFlow
              adds features, changes its services, or when
              applicable requirements change. Updated versions
              may be published on this page.
            </p>
          </section>

          {/* 13 */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              13. Contact
            </h2>

            <p className="text-sm leading-7 text-slate-600">
              If you have questions about this Privacy Policy
              or how your information is handled, contact the
              AuthFlow service administrator through the
              available support channels.
            </p>
          </section>

          {/* Last Updated */}
          <div className="border-t border-slate-200 pt-5">
            <p className="text-xs text-slate-400">
              Last updated: September 30, 2026
            </p>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <Link
            to="/"
            className="font-medium text-slate-500 hover:text-emerald-600"
          >
            Sign Up
          </Link>

          <span className="text-slate-300">•</span>

          <Link
            to="/terms"
            className="font-medium text-slate-500 hover:text-emerald-600"
          >
            Terms of Service
          </Link>

          <span className="text-slate-300">•</span>

          <Link
            to="/login"
            className="font-medium text-slate-500 hover:text-emerald-600"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;