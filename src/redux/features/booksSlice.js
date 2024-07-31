import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

// Fetch all books
export const fetchBooks = createAsyncThunk("books/fetchBooks", async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const response = await axiosInstance.get("/books");
  return response.data.data;
});

// Fetch featured books
export const fetchFeaturedBooks = createAsyncThunk(
  "books/fetchFeaturedBooks",
  async () => {
    const response = await axiosInstance.get("/books/featured");
    return response.data.data;
  }
);

// Fetch recommended books
export const fetchRecommendedBooks = createAsyncThunk(
  "books/fetchRecommendedBooks",
  async () => {
    const response = await axiosInstance.get("/books/recommended");
    return response.data.data;
  }
);

// All books slice
export const bookSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    loading: false,
    error: null,
  },
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
        state.error = action.error.message;
      });
  },
});

// Recommended books slice
export const recommendedSlice = createSlice({
  name: "recommended",
  initialState: {
    books: [],
    loading: false,
    error: null,
  },
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
        state.error = action.error.message;
      });
  },
});

// Featured books slice
export const featuredBooksSlice = createSlice({
  name: "featured",
  initialState: {
    books: [],
    loading: false,
    error: null,
  },
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
        state.error = action.error.message;
      });
  },
});

// Exporting reducers
export const booksReducer = bookSlice.reducer;
export const recommendedReducer = recommendedSlice.reducer;
export const featuredBooksReducer = featuredBooksSlice.reducer;
