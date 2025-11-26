import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { loginBanner, logo } from "@/assets";
import { useAppSelector } from "@/redux/hooks";
import LoginForm from "./Login/components/loginForm";

const LoginPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fefaf5] via-white to-[#f3f0ff] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] rounded-[32px] bg-white shadow-[0_30px_120px_rgba(34,34,34,0.12)] overflow-hidden border border-white/40">
        <div className="relative hidden md:flex flex-col justify-between bg-gradient-to-br from-[#fef3e5] via-[#fdf7ef] to-white px-12 py-10">
          <div className="flex items-center gap-3 text-sm font-medium tracking-[0.3em] text-downy-dark uppercase">
            <span className="h-2 w-2 rounded-full bg-downy" />
            Page Chat
            <span className="h-2 w-2 rounded-full bg-downy" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-charcoal leading-tight">
              Slow down, breathe, and settle into your next favorite book.
            </h1>
            <p className="mt-4 text-charcoal/70 text-sm">
              Join fellow readers in a calm, curated space that honors depth,
              reflection, and intentional community.
            </p>
          </div>
          <img
            src={loginBanner}
            alt="Reading illustration"
            className="mt-10 w-full max-w-md self-center drop-shadow-2xl"
          />
        </div>
        <div className="flex flex-col justify-center px-8 py-12 space-y-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <img
              src={logo}
              alt="Page Chat logo"
              className="w-20 h-20 rounded-full bg-white shadow-md"
            />
            <p className="text-xs font-semibold tracking-[0.4em] text-downy-dark uppercase">
              Welcome back
            </p>
            <h2 className="text-3xl font-semibold text-charcoal">
              Log in to your sanctuary
            </h2>
            <p className="text-sm text-charcoal/70">
              Continue your reading journey with curated shelves, guided
              reflections, and trusted voices.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
