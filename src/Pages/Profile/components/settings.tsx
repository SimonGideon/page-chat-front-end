import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Key, Loader2, Lock, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import axiosInstance from "@/redux/utils/axiosInstance";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/authSlice";

const PasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirm_password: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type PasswordFormValues = z.infer<typeof PasswordSchema>;

const Settings = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [updatingNotifs, setUpdatingNotifs] = useState(false);

  useEffect(() => {
    if (user?.email_notifications !== undefined) {
      setEmailNotifications(user.email_notifications);
    }
  }, [user]);

  const handleEmailToggle = async () => {
    if (!user) return;
    const newValue = !emailNotifications;
    setEmailNotifications(newValue); // Optimistic
    setUpdatingNotifs(true);

    try {
      await axiosInstance.patch(`/users/${user.id}`, {
        user: { email_notifications: newValue }
      });
      dispatch(setUser({ ...user, email_notifications: newValue }));
      toast({
        title: "Preferences Updated",
        description: `Email notifications ${newValue ? "enabled" : "disabled"}.`,
        variant: "success",
      });
    } catch (error) {
      setEmailNotifications(!newValue); // Revert
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update preferences.",
        variant: "destructive",
      });
    } finally {
        setUpdatingNotifs(false);
    }
  };

  const onSubmit = async (data: PasswordFormValues) => {
    setIsSubmitting(true);
    try {
      await axiosInstance.patch("/users/change_password", {
        user: {
          current_password: data.current_password,
          password: data.new_password,
          password_confirmation: data.confirm_password,
        },
      });

      toast({
        title: "Success",
        description: "Password changed successfully",
        variant: "success",
      });

      form.reset();
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; errors?: string[] } };
      };
      toast({
        title: "Error",
        description:
          err.response?.data?.errors?.[0] ||
          err.response?.data?.message ||
          "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">


      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-8">
         <div className="flex items-center justify-between">
            <div className="space-y-0.5">
                <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-downy" />
                    Email Notifications
                </h3>
                <p className="text-sm text-gray-500">
                    Receive emails for likes, replies, and comments.
                </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={emailNotifications}
                    onChange={handleEmailToggle}
                    disabled={updatingNotifs}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-downy/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-downy"></div>
            </label>
         </div>
      </div>

      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Key className="w-5 h-5 text-downy" />
          Change Password
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Update your password to keep your account secure
        </p>
      </div>

      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="current_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        className="pl-10 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        className="pl-10 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        className="pl-10 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-downy hover:bg-downy-dark text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Settings;
