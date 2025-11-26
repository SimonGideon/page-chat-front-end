import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";

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
import { submitNewPassword, validateResetToken } from "@/lib/services/password";

const FormSchema = z
  .object({
    password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  });

type ResetPasswordFormValues = z.infer<typeof FormSchema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"validating" | "invalid" | "valid">(
    token ? "validating" : "invalid",
  );
  const [userEmail, setUserEmail] = useState("");

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    validateResetToken(token)
      .then((response) => {
        setUserEmail(response.data.email);
        setStatus("valid");
      })
      .catch(() => setStatus("invalid"));
  }, [token]);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      await submitNewPassword(token, values.password, values.password_confirmation);
      toast({
        title: "Password updated",
        description: "You can now sign in with your new password.",
        variant: "success",
      });
      navigate("/signin");
    } catch (error: unknown) {
      toast({
        title: "Unable to update password",
        description: "Please try again in a few minutes.",
        variant: "destructive",
      });
    }
  };

  if (status === "validating") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="rounded-3xl bg-white px-10 py-12 text-center shadow-xl">
          <p className="text-sm font-medium text-charcoal/70">Validating your reset link...</p>
        </div>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="max-w-md space-y-4 rounded-3xl bg-white px-10 py-12 text-center shadow-xl">
          <h1 className="text-2xl font-semibold text-charcoal">Reset link invalid</h1>
          <p className="text-sm text-charcoal/70">
            This link is invalid or has expired. Request a new password reset link to continue.
          </p>
          <Link
            to="/forgot-password"
            className="inline-flex w-full items-center justify-center rounded-full bg-downy px-6 py-3 text-sm font-semibold text-white transition hover:bg-downy-dark"
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-3xl p-8 space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-downy-dark">Set new password</p>
          <h1 className="text-3xl font-semibold text-charcoal mt-2">Choose a strong password</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Resetting password for <span className="font-medium text-charcoal">{userEmail}</span>
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">
                    New password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      className="h-12 rounded-xl border-[#e4d5bb] bg-white/90 text-charcoal placeholder:text-charcoal/50 focus:border-downy focus:ring-downy/25"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">
                    Confirm password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      className="h-12 rounded-xl border-[#e4d5bb] bg-white/90 text-charcoal placeholder:text-charcoal/50 focus:border-downy focus:ring-downy/25"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full h-12 rounded-full bg-downy text-white font-semibold tracking-wide hover:bg-downy-dark transition"
            >
              {form.formState.isSubmitting ? "Updating..." : "Update password"}
            </Button>
          </form>
        </Form>
        <div className="flex items-center justify-between text-sm text-charcoal/70">
          <Link to="/signin" className="text-downy hover:text-downy-dark font-medium">
            Back to login
          </Link>
          <Link to="/" className="hover:text-charcoal">
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

