import { LoginForm } from "@/components";
import { loginBanner } from "@/assets";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logo } from "@/assets";
const LoginPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  return (
    <>
      <div className="mt-28 w-4/5 md:w-3/4 lg:w-2/4 mx-auto flex md:flex-row sm:space-x-0 md:space-x-6 bg-white shadow-md rounded-lg align-middle">
        <div className="hidden md:block login-banner">
          <div className="p-12">
            <h1 className="text-3xl font-bold">Welcome</h1>
            <p className="text-gray-500">Please login to continue</p>
          </div>
          <img src={loginBanner} alt="login banner" className="w-80 mt-8" />
        </div>
        <div className="p-8">
          <div className="flex flex-col items-center mb-2">
            <img className="w-1/4 md:hidden " src={logo} alt="logo" />
            <h1 className="self-start text-3xl my-1 md:my-2 font-bold">
              LOGIN
            </h1>
          </div>
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
