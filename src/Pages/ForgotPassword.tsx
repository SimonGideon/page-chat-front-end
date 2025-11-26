import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import {
  Button,
  Form,
  FormField,
  FormItem,
  FormLabel,
  Input,
  FormControl,
  FormMessage,
  toast,
} from "@/components/ui";
import { requestPasswordReset } from "@/lib/services/password";

const FormSchema = z.object({
  email: z.string().email({ message: "Please provide a valid email address." }),
});

type ForgotPasswordFormValues = z.infer<typeof FormSchema>;

const ForgotPassword = () => {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await requestPasswordReset(values.email);
      toast({
        title: "Reset link sent",
        description:
          "If the email exists in our records, you will receive a password reset link shortly.",
        variant: "success",
      });
      form.reset();
    } catch (_error: unknown) {
      toast({
        title: "Unable to process request",
        description: "Please try again in a few minutes." + _error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-3xl p-8 space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-downy-dark">
            Password Reset
          </p>
          <h1 className="text-3xl font-semibold text-charcoal mt-2">
            Forgot your password?
          </h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Enter the email associated with your account and we&apos;ll email
            you a secure link to create a new password.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">
                    Email address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
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
              {form.formState.isSubmitting
                ? "Sending link..."
                : "Send reset link"}
            </Button>
          </form>
        </Form>
        <div className="flex items-center justify-between text-sm text-charcoal/70">
          <Link
            to="/signin"
            className="text-downy hover:text-downy-dark font-medium"
          >
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

export default ForgotPassword;
