import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

import type { ApiError, FavoriteBookEntry, Identifier } from "@/types";

import axiosInstance from "../utils/axiosInstance";

interface FavoriteState {
  favBooks: FavoriteBookEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoriteState = {
  favBooks: [],
  loading: false,
  error: null,
};

export const fetchFavoriteBooks = createAsyncThunk<
  FavoriteBookEntry[],
  Identifier,
  { rejectValue: ApiError }
>("favorites/fetchFavoriteBooks", async (userId, thunkAPI) => {
  try {
    const response = await axiosInstance.get<{ data: FavoriteBookEntry[] }>(
      `/favorites/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    const apiError =
      (error as AxiosError<ApiError>).response?.data ??
      ({ message: "Unable to load favorites" } as ApiError);
    return thunkAPI.rejectWithValue(apiError);
  }
});

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoriteBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoriteBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.favBooks = action.payload;
      })
      .addCase(fetchFavoriteBooks.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ?? action.error.message ?? "Unknown error";
      });
  },
});

export const favoriteBookReducer = favoriteSlice.reducer;
