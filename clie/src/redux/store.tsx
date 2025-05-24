// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./followingslice";
import followerReducer from "./followers.slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    follower: followerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
