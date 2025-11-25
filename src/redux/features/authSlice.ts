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

    const headers = response.headers as Record<string, string | undefined>;
    const authorizationHeader =
      headers.authorization ?? headers.Authorization ?? null;
    const token = authorizationHeader
      ? authorizationHeader.split(" ")[1] ?? null
      : null;

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
  { rejectValue: ApiError }
>("auth/getCurrentUser", async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get<AuthApiResponse>("/current_user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    const apiError =
      (error as AxiosError<ApiError>).response?.data ??
      ({ message: "Unable to fetch user" } as ApiError);
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
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
