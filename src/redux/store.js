import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import booksReducer from "./features/booksSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
  },
});

export default store;
