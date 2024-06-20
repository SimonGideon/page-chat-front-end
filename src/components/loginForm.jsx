"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

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
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data) {
    try {
      const response = await axios.post("http://localhost:4000/login", {
        user: {
          email: data.email,
          password: data.password,
        },
      });

      // Handle the response from the server
      if (response.status === 200) {
        toast({
          title: "Login Successful",
          variant: "success",
          description: "You have successfully logged in.",
        });
      } else {
        toast({
          title: "Login Failed",
          variant: "destructive",
          description: "Invalid email or password.",
        });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          toast({
            title: "Login Failed",
            variant: "destructive",
            description: "Invalid email or password.",
          });
        } else {
          toast({
            title: "Login Failed",
            variant: "destructive",
            description:
              error.response.data.message || "An error occurred during login.",
          });
        }
      } else if (error.request) {
        toast({
          title: "Login Failed",
          variant: "destructive",
          description: "No response received from the server.",
        });
      } else {
        toast({
          title: "Login Failed",
          variant: "destructive",
          description: "An error occurred while sending the request.",
        });
      }
    }
  }

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
