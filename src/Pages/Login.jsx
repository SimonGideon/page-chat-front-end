import { LoginForm } from "@/components";

const LoginPage = () => {
  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold">Login</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
