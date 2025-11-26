import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { logo } from "@/assets";
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
import axiosInstance from "@/redux/utils/axiosInstance";

const SignUpSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  membership_number: z.string().min(3, "Membership number is required"),
  phone: z.string().min(6, "Phone is required"),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  gender: z.string().min(1, "Gender is required"),
  nationality: z.string().min(2, "Nationality is required"),
  date_of_birth: z.string().min(4, "Date of birth is required"),
});

type SignUpValues = z.infer<typeof SignUpSchema>;

const SignUp = () => {
  const navigate = useNavigate();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      membership_number: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      gender: "",
      nationality: "",
      date_of_birth: "",
    },
  });

  const onSubmit = async (values: SignUpValues) => {
    try {
      await axiosInstance.post("/signup", {
        user: values,
      });

      toast({
        title: "Account created",
        description:
          "Please check your email to activate your account and choose a password.",
        variant: "success",
      });
      navigate("/signin");
    } catch (error: unknown) {
      toast({
        title: "Unable to create account",
        description:
          "We couldn’t complete your registration. Please review your details and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fefaf5] via-white to-[#f3f0ff] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-[32px] bg-white shadow-[0_30px_120px_rgba(34,34,34,0.12)] border border-white/40 px-8 py-10 space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <img
            src={logo}
            alt="Page Chat logo"
            className="w-20 h-20 rounded-full bg-white shadow-md"
          />
          <p className="text-xs font-semibold tracking-[0.4em] text-downy-dark uppercase">
            Join the community
          </p>
          <h1 className="text-3xl font-semibold text-charcoal">
            Create your Page Chat account
          </h1>
          <p className="text-sm text-charcoal/70 max-w-xl">
            Share a few details so we can connect you with the right shelves,
            clubs, and conversations. You&apos;ll receive an email to activate
            your account and set a secure password.
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">
                    First name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jane"
                      className="h-12 rounded-2xl border border-[#efe6da] bg-white/90 px-4 text-charcoal placeholder:text-charcoal/50 focus:border-downy focus:ring-downy/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">
                    Last name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      className="h-12 rounded-2xl border border-[#efe6da] bg-white/90 px-4 text-charcoal placeholder:text-charcoal/50 focus:border-downy focus:ring-downy/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-sm font-medium text-charcoal">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      className="h-12 rounded-2xl border border-[#efe6da] bg-white/90 px-4 text-charcoal placeholder:text-charcoal/50 focus:border-downy focus:ring-downy/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="membership_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">
                    Membership number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="M1234"
                      className="h-12 rounded-2xl border border-[#efe6da] bg-white/90 px-4 text-charcoal placeholder:text-charcoal/50 focus:border-downy focus:ring-downy/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">
                    Phone
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+255..."
                      className="h-12 rounded-2xl border border-[#efe6da] bg-white/90 px-4 text-charcoal placeholder:text-charcoal/50 focus:border-downy focus:ring-downy/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-sm font-medium text-charcoal">
                    Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Street, area"
                      className="h-12 rounded-2xl border border-[#efe6da] bg-white/90 px-4 text-charcoal placeholder:text-charcoal/50 focus:border-downy focus:ring-downy/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">
                    City
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="City"
                      className="h-12 rounded-2xl border border-[#efe6da] bg-white/90 px-4 text-charcoal placeholder:text-charcoal/50 focus:border-downy focus:ring-downy/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">
                    Country
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Country"
                      className="h-12 rounded-2xl border border-[#efe6da] bg-white/90 px-4 text-charcoal placeholder:text-charcoal/50 focus:border-downy focus:ring-downy/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">
                    Gender
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Female / Male / ..."
                      className="h-12 rounded-2xl border border-[#efe6da] bg-white/90 px-4 text-charcoal placeholder:text-charcoal/50 focus:border-downy focus:ring-downy/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">
                    Nationality
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nationality"
                      className="h-12 rounded-2xl border border-[#efe6da] bg-white/90 px-4 text-charcoal placeholder:text-charcoal/50 focus:border-downy focus:ring-downy/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">
                    Date of birth
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="h-12 rounded-2xl border border-[#efe6da] bg-white/90 px-4 text-charcoal placeholder:text-charcoal/50 focus:border-downy focus:ring-downy/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:col-span-2 flex flex-col gap-3 mt-4">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full h-12 rounded-full bg-downy text-white font-semibold tracking-wide shadow-lg shadow-downy/30 transition hover:bg-downy-dark"
              >
                {form.formState.isSubmitting
                  ? "Creating account..."
                  : "Create account"}
              </Button>
              <p className="text-xs text-center text-charcoal/60">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="font-medium text-downy hover:text-downy-dark"
                >
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;
