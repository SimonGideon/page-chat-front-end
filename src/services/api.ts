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
  getBook: async (bookId: string) => {
    const response = await axiosInstance.get<{ data: any }>(`/books/${bookId}`);
    return response.data;
  },
  getBookDiscussions: async (bookId: string, page = 1) => {
    const response = await axiosInstance.get<{ data: any[]; meta: { total_count: number } }>(`/books/${bookId}/discussions?page=${page}`);
    return response.data;
  },
  getDiscussionComments: async (discussionId: string, page = 1) => {
    const response = await axiosInstance.get<{ data: any[]; meta: { total_count: number } }>(`/books/na/discussions/${discussionId}/comments?page=${page}`);
    return response.data;
  },
  createDiscussion: async (bookId: string, data: { title: string; body: string }) => {
    const response = await axiosInstance.post(`/books/${bookId}/discussions`, {
      discussion: data,
    });
    return response.data;
  },
  createComment: async (
    discussionId: string,
    data: { body: string; parent_id?: string | number }
  ) => {
    const response = await axiosInstance.post(
      `/books/na/discussions/${discussionId}/comments`,
      {
        comment: data,
      }
    );
    return response.data;
  },
  addToFavorites: async (bookId: string) => {
    const response = await axiosInstance.post(`/favorites`, {
      favorite: { book_id: bookId },
    });
    return response.data;
  },
  removeFromFavorites: async (favoriteId: string | number) => {
    const response = await axiosInstance.delete(`/favorites/${favoriteId}`);
    return response.data;
  },
  getFavorites: async () => {
    const response = await axiosInstance.get(`/favorites`);
    return response.data; // Expecting { data: Book[] }
  },
  getEngagements: async (page = 1) => {
    const response = await axiosInstance.get<{ data: any[]; meta: { total_count: number } }>(`/engagements?page=${page}`);
    return response.data;
  },
  likeComment: async (commentId: string | number) => {
    const response = await axiosInstance.post(`/books/na/discussions/na/comments/${commentId}/like`);
    return response.data;
  },
  unlikeComment: async (commentId: string | number) => {
    const response = await axiosInstance.delete(`/books/na/discussions/na/comments/${commentId}/like`);
    return response.data;
  },
  updateReadingPosition: async (bookId: string | number, data: { page_number: number; scroll_offset?: number; percentage_completed?: number }) => {
    const response = await axiosInstance.patch(`/books/${bookId}/reading_position`, data);
    return response.data;
  },
  getNotifications: async (page = 1) => {
    const response = await axiosInstance.get<{ data: any[]; meta: { unread_count: number; total_pages: number } }>(`/notifications?page=${page}`);
    return response.data;
  },
  markNotificationAsRead: async (id: string | number) => {
    const response = await axiosInstance.patch(`/notifications/${id}/mark_as_read`);
    return response.data;
  },
  markAllNotificationsAsRead: async () => {
    const response = await axiosInstance.patch(`/notifications/mark_all_as_read`);
    return response.data;
  },
};
