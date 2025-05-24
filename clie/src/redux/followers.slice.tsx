// src/redux/followerSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const baseUrl= import.meta.env.VITE_API_BASE_URL
export const fetchFollowers = createAsyncThunk(
  "follower/fetchFollowers",
  async () => {
         const token = localStorage.getItem("accessToken");
          const responsee = await axios.get(`${baseUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Logged-in user responssdsfe:", responsee.data);
        const userId = responsee.data.result._id;
        console.log("Logged-in user ID:", userId);
    const response = await axios.get(`${baseUrl}/auth/followers/${userId}`);
    return response.data.result;
  }
);

const followerSlice = createSlice({
  name: "follower",
  initialState: {
    followers: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.loading = false;
        state.followers = action.payload;
      })
      .addCase(fetchFollowers.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default followerSlice.reducer;
