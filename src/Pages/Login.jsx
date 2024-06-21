import { LoginForm } from "@/components";
import { loginBanner } from "@/assets";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  return (
    <div className="mt-10 w-2/4 mx-auto flex md:flex-row space-x-6 bg-white shadow-md rounded-lg">
      <div className="login-banner">
        <div className="p-12">
          <h1 className="text-3xl font-bold">Welcome</h1>
          <p className="text-gray-500">Please login to continue</p>
        </div>
        <img src={loginBanner} alt="login banner" className="w-80 mt-8" />
      </div>
      <div className="p-8">
        <h1 className="text-3xl my-4 font-bold">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
