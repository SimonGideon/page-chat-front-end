import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import {
  booksReducer,
  recommendedReducer,
  featuredBooksReducer,
} from "./features/booksSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    recommended: recommendedReducer,
    featured: featuredBooksReducer,
  },
});

export default store;
