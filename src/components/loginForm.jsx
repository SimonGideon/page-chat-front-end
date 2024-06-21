"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/redux/features/authSlice";

import {
  Button,
  Input,
  toast,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui";

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    dispatch(login(data))
      .unwrap()
      .then(() => {
        toast({
          title: "Login Successful",
          variant: "success",
          description: "You have successfully logged in.",
        });
        // Additional actions after login success
        navigate("/dashboard");
      })
      .catch((err) => {
        toast({
          title: "Login Failed",
          variant: "destructive",
          description: err.message || "An error occurred during login.",
        });
      });
  };

  return (
    <Form {...form} className="w-full border-stone-950">
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

        <Button type="submit" className="bg-downy text-white hover:bg-spray">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
