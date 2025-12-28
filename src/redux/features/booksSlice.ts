import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

import type { ApiError, Book } from "@/types";

import axiosInstance from "../utils/axiosInstance";

interface BooksState {
  books: Book[];
  loading: boolean;
  error: string | null;
}

const createInitialState = (): BooksState => ({
  books: [],
  loading: false,
  error: null,
});

const resolveErrorMessage = (payload?: ApiError, fallback?: string | null) =>
  payload?.message ?? fallback ?? "Unable to fetch books";

export const fetchBooks = createAsyncThunk<
  Book[],
  { language?: string } | void,
  { rejectValue: ApiError }
>("books/fetchBooks", async (params, thunkAPI) => {
  try {
    const response = await axiosInstance.get<{ data: Book[] }>("/books", {
      params,
    });
    return response.data.data;
  } catch (error) {
    const apiError =
      (error as AxiosError<ApiError>).response?.data ??
      ({ message: "Unable to fetch books" } as ApiError);
    return thunkAPI.rejectWithValue(apiError);
  }
});

export const fetchFeaturedBooks = createAsyncThunk<
  Book[],
  { language?: string } | void,
  { rejectValue: ApiError }
>("books/fetchFeaturedBooks", async (params, thunkAPI) => {
  try {
    const response = await axiosInstance.get<{ data: Book[] }>(
      "/books/featured",
      { params }
    );
    return response.data.data;
  } catch (error) {
    const apiError =
      (error as AxiosError<ApiError>).response?.data ??
      ({ message: "Unable to fetch featured books" } as ApiError);
    return thunkAPI.rejectWithValue(apiError);
  }
});

export const fetchRecommendedBooks = createAsyncThunk<
  Book[],
  { language?: string } | void,
  { rejectValue: ApiError }
>("books/fetchRecommendedBooks", async (params, thunkAPI) => {
  try {
    const response = await axiosInstance.get<{ data: Book[] }>(
      "/books/recommended",
      { params }
    );
    return response.data.data;
  } catch (error) {
    const apiError =
      (error as AxiosError<ApiError>).response?.data ??
      ({ message: "Unable to fetch recommended books" } as ApiError);
    return thunkAPI.rejectWithValue(apiError);
  }
});

export const bookSlice = createSlice({
  name: "books",
  initialState: createInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = resolveErrorMessage(action.payload, action.error.message);
      });
  },
});

export const recommendedSlice = createSlice({
  name: "recommended",
  initialState: createInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendedBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendedBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchRecommendedBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = resolveErrorMessage(action.payload, action.error.message);
      });
  },
});

export const featuredBooksSlice = createSlice({
  name: "featured",
  initialState: createInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeaturedBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchFeaturedBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = resolveErrorMessage(action.payload, action.error.message);
      });
  },
});

export const booksReducer = bookSlice.reducer;
export const recommendedReducer = recommendedSlice.reducer;
export const featuredBooksReducer = featuredBooksSlice.reducer;
