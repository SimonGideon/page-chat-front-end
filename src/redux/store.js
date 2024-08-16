import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import {
  booksReducer,
  recommendedReducer,
  featuredBooksReducer,
} from "./features/booksSlice";
import { favoriteBookReducer } from "./features/favoriteSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    recommended: recommendedReducer,
    featured: featuredBooksReducer,
    favBooks: favoriteBookReducer,
  },
});

export default store;
