import { Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
} from "lucide-react";

const TermsOfService = () => {
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
              <FileText size={26} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Terms of Service
              </h1>

              <p className="mt-1 text-sm text-white/80">
                Terms and conditions for using AuthFlow
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex gap-3">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-emerald-600"
              />

              <p className="text-sm leading-6 text-emerald-800">
                By creating an AuthFlow account or using
                AuthFlow services, you agree to follow these
                Terms of Service.
              </p>
            </div>
          </div>

          {/* 1 */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              1. About AuthFlow
            </h2>

            <p className="text-sm leading-7 text-slate-600">
              AuthFlow is an authentication platform designed
              to provide account registration, email
              verification, password authentication, Google
              authentication, password recovery, and related
              account security features.
            </p>
          </section>

          {/* 2 */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              2. Creating an Account
            </h2>

            <p className="mb-3 text-sm leading-7 text-slate-600">
              When creating an account, you agree to provide
              accurate and current information. You are
              responsible for maintaining the accuracy of the
              information associated with your account.
            </p>

            <p className="text-sm leading-7 text-slate-600">
              You must not create an account using another
              person's identity or information without
              authorization.
            </p>
          </section>

          {/* 3 */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              3. Email Verification
            </h2>

            <p className="text-sm leading-7 text-slate-600">
              AuthFlow may require email verification before
              an account can be fully activated. Verification
              codes are temporary and should not be shared with
              other people.
            </p>
          </section>

          {/* 4 */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              4. Google Sign-In
            </h2>

            <p className="text-sm leading-7 text-slate-600">
              AuthFlow may allow you to create or access an
              account using Google Sign-In. When using Google
              authentication, information provided by Google,
              such as your name, email address, and profile
              picture, may be associated with your AuthFlow
              account.
            </p>
          </section>

          {/* 5 */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              5. Password Security
            </h2>

            <p className="text-sm leading-7 text-slate-600">
              You are responsible for keeping your password
              confidential. Do not share your password or
              authentication credentials with anyone.
            </p>
          </section>

          {/* 6 */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              6. Acceptable Use
            </h2>

            <p className="mb-3 text-sm leading-7 text-slate-600">
              You agree not to misuse AuthFlow or attempt to
              interfere with its security or operation.
            </p>

            <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
              <li>
                Do not attempt unauthorized access to accounts.
              </li>

              <li>
                Do not attempt to bypass authentication or
                security controls.
              </li>

              <li>
                Do not use the service for unlawful activities.
              </li>

              <li>
                Do not intentionally disrupt or overload the
                service.
              </li>

              <li>
                Do not attempt to obtain another user's
                private authentication information.
              </li>
            </ul>
          </section>

          {/* 7 */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              7. Account Security
            </h2>

            <p className="text-sm leading-7 text-slate-600">
              If you believe that your account or credentials
              have been compromised, you should change your
              password and take appropriate steps to secure
              your account.
            </p>
          </section>

          {/* 8 */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              8. Account Termination
            </h2>

            <p className="text-sm leading-7 text-slate-600">
              AuthFlow may restrict or terminate access to an
              account if the account is used in violation of
              these Terms or applicable laws.
            </p>
          </section>

          {/* 9 */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              9. Service Availability
            </h2>

            <p className="text-sm leading-7 text-slate-600">
              AuthFlow is provided on an ongoing development
              basis. Features may be changed, updated,
              temporarily unavailable, or discontinued as the
              platform evolves.
            </p>
          </section>

          {/* 10 */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              10. Changes to These Terms
            </h2>

            <p className="text-sm leading-7 text-slate-600">
              These Terms may be updated from time to time.
              Continued use of AuthFlow after an update may
              require acceptance of the revised Terms.
            </p>
          </section>

          {/* 11 */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              11. Contact
            </h2>

            <p className="text-sm leading-7 text-slate-600">
              If you have questions about these Terms of
              Service, you can contact the AuthFlow support
              team through the available support channels.
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

export default TermsOfService;