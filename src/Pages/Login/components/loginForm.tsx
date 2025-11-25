import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { login } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
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

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

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
        navigate("/dashboard");
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
              <FormLabel className="block text-sm font-medium text-gray-700">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="example@example.com"
                  className="text-gray-400 mt-1 block border-gray-500 shadow-sm focus:border-downy focus:ring focus:ring-downy-200 focus:ring-opacity-50"
                  {...field}
                />
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
              <FormLabel className="block text-sm font-medium text-gray-700">
                Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="********"
                  {...field}
                  className="text-gray-400 mt-1 block w-full rounded-md border-gray-500 shadow-sm focus:border-downy focus:ring focus:ring-downy-200 focus:ring-opacity-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="bg-downy text-white hover:bg-spray rounded py-2 w-full"
          disabled={loading || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Logging in..." : "Login"}
        </Button>
        <div className="flex justify-between">
          <a
            href="/forgot-password"
            className="text-sm text-downy hover:text-spray"
          >
            Forgot Password?
          </a>
          <a href="/" className="text-sm text-downy hover:text-spray">
            Home
          </a>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
