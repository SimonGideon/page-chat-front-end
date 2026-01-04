import axiosInstance from "@/redux/utils/axiosInstance";

export const requestPasswordReset = (email: string) =>
  axiosInstance.post("/password/reset", { email });

export const validateResetToken = (token: string) =>
  axiosInstance.get("/password/reset", { params: { token } });

export const submitNewPassword = (
  token: string,
  password: string,
  passwordConfirmation: string
) =>
  axiosInstance.put("/password/reset", {
    token,
    password,
    password_confirmation: passwordConfirmation,
  });
