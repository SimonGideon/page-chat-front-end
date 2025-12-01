import axiosInstance from "@/redux/utils/axiosInstance";

export interface ActivationResponse {
  message: string;
  redirect_to?: string;
}

export const activateAccount = (confirmation_token: string, email: string) =>
  axiosInstance.get<ActivationResponse>("/activate-account", {
    params: { confirmation_token, email },
  });
