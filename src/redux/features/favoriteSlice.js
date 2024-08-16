import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

// Async thunk action to fetch user's favorite books
export const fetchFavoriteBooks = createAsyncThunk(
  "favorites/fetchFavoriteBooks",
  async (userId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/favorites/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// favorite books slice
const favoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    favBooks: [],
    loading: false,
    error: null,
  },
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
        state.error = action.error.message;
      });
  },
});

export const favoriteBookReducer = favoriteSlice.reducer;
