import axiosInstance from "@/redux/utils/axiosInstance";

export const apiClient = {
  post: async <T = unknown>(url: string, data?: unknown): Promise<T> => {
    const response = await axiosInstance.post<T>(url, data);
    return response.data;
  },
  get: async <T = unknown>(url: string): Promise<T> => {
    const response = await axiosInstance.get<T>(url);
    return response.data;
  },
  getLanguages: async () => {
    const response = await axiosInstance.get<{
      data: { text: string; value: string }[];
    }>("/dropdown/get-drop-down-list?page=languages");
    return response.data;
  },
};
