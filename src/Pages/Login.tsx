import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { loginBanner, logo } from "@/assets";
import { LoginForm } from "@/components";
import { useAppSelector } from "@/redux/hooks";

const LoginPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="bg-slate-100 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg flex flex-col md:flex-row">
        <div className="hidden md:flex flex-col justify-center items-center bg-slate-50 p-12 rounded-l-lg">
          <h1 className="text-3xl font-bold mb-4">Welcome</h1>
          <p className="text-gray-500 mb-8">Please login to continue</p>
          <img src={loginBanner} alt="login banner" className="w-60" />
        </div>
        <div className="flex flex-col justify-center w-full p-6 md:p-8">
          <div className="flex flex-col items-center mb-4">
            <img
              className="w-1/3 mb-4 md:hidden"
              src={logo}
              alt="Book Chat logo"
            />
            <h1 className="self-start text-3xl font-bold mb-2">LOGIN</h1>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
