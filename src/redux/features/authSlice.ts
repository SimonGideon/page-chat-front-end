import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

import type { ApiError, ApiStatus, User } from "@/types";

import axiosInstance from "../utils/axiosInstance";

type LoginPayload = {
  email: string;
  password: string;
};

interface AuthApiResponse {
  data: User;
  status: ApiStatus;
}

interface LoginResponse extends AuthApiResponse {
  token: string | null;
}

interface AuthState {
  user: User | null;
  message: string | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  message: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  loading: false,
  error: null,
};

const extractErrorMessage = (
  payload?: ApiError,
  fallback?: string | null
): string => {
  return (
    payload?.status?.message ??
    payload?.message ??
    fallback ??
    "Something went wrong"
  );
};

export const login = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: ApiError }
>("auth/login", async (userData, thunkAPI) => {
  try {
    const response = await axiosInstance.post<AuthApiResponse>("/login", {
      user: userData,
    });

    // Extract token from Authorization header (axios stores headers in lowercase)
    let token: string | null = null;
    const authHeader = response.headers["authorization"] as string | undefined;

    if (authHeader) {
      // Remove "Bearer " prefix if present
      token = authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : authHeader;
    }

    if (token) {
      localStorage.setItem("token", token);
    }

    return {
      ...response.data,
      token,
    };
  } catch (error) {
    const apiError =
      (error as AxiosError<ApiError>).response?.data ??
      ({ message: "Unable to login" } as ApiError);
    return thunkAPI.rejectWithValue(apiError);
  }
});

export const getCurrentUser = createAsyncThunk<
  AuthApiResponse,
  void,
  { rejectValue: ApiError & { statusCode?: number } }
>("auth/getCurrentUser", async (_, thunkAPI) => {
  try {
    // Token is automatically added by axios interceptor
    const response = await axiosInstance.get<AuthApiResponse>("/current_user");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    const statusCode = axiosError.response?.status;
    const apiError = {
      ...(axiosError.response?.data ?? { message: "Unable to fetch user" }),
      statusCode,
    };
    return thunkAPI.rejectWithValue(apiError);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    setUser: (state, action) => {
       state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
        state.error = null;
        state.message = action.payload.status?.message ?? null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        const errorMessage = extractErrorMessage(
          action.payload,
          action.error.message
        );
        state.error = errorMessage;
        state.message = errorMessage;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = extractErrorMessage(action.payload, action.error.message);
        // Only clear token if it's an authentication error (401)
        if (action.payload?.statusCode === 401) {
          state.token = null;
          state.user = null;
          localStorage.removeItem("token");
        }
      });
  },
});

export const { logout, setUser } = authSlice.actions;

export default authSlice.reducer;
