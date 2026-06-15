import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { login } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  toast,
} from "@/components/ui";

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof FormSchema>;

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const passwordInputType = showPassword ? "text" : "password";

  const onSubmit = (data: LoginFormValues) => {
    dispatch(login(data))
      .unwrap()
      .then((response) => {
        toast({
          title: "Login Successful",
          variant: "success",
          description:
            response.status?.message ?? "You have successfully logged in.",
        });
        navigate("/dashboard", { replace: true });
      })
      .catch((error) => {
        const description =
          error?.status?.message ??
          error?.message ??
          "Invalid email or password.";
        toast({
          title: "Login Failed",
          variant: "destructive",
          description,
        });
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-medium text-charcoal">
                  Email
                </FormLabel>
                <span className="text-xs text-charcoal/50">
                  Use your member email
                </span>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="you@example.com"
                    className="h-12 rounded-2xl border border-[#efe6da] bg-white/90 pl-12 pr-4 text-charcoal placeholder:text-charcoal/50 focus:border-downy focus:ring-downy/20"
                    {...field}
                  />
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-downy"
                    size={18}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-medium text-charcoal">
                  Password
                </FormLabel>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-xs font-medium text-downy hover:text-downy-dark"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    type={passwordInputType}
                    placeholder="Enter your password"
                    {...field}
                    className="h-12 rounded-2xl border border-[#efe6da] bg-white/90 pl-12 pr-14 text-charcoal placeholder:text-charcoal/50 focus:border-downy focus:ring-downy/20"
                  />
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-downy"
                    size={18}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-charcoal/60 hover:text-downy"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-downy/60">
                    •••
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-12 rounded-full bg-downy text-white font-semibold tracking-wide shadow-lg shadow-downy/30 transition hover:bg-downy-dark"
          disabled={loading || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Logging in..." : "Login"}
        </Button>
        {/* ── Divider ──────────────────────────────────────────── */}
        <div className="relative flex items-center gap-3">
          <div className="h-px flex-1 bg-[#efe6da]" />
          <span className="text-xs text-charcoal/40">or continue with</span>
          <div className="h-px flex-1 bg-[#efe6da]" />
        </div>

        <GoogleAuthButton label="Sign in with Google" />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4">
            <Link
              to="/forgot-password"
              className="text-sm text-downy hover:text-spray"
            >
              Forgot password?
            </Link>
            <Link to="/" className="text-sm text-downy hover:text-spray">
              Home
            </Link>
          </div>
          <p className="text-xs text-charcoal/60">
            New here?{" "}
            <Link
              to="/signup"
              className="font-medium text-downy hover:text-downy-dark"
            >
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
