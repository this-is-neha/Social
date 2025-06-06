// src/redux/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const baseUrl= import.meta.env.VITE_API_BASE_URL
export const fetchUserFollowing = createAsyncThunk(
  "user/fetchFollowing",
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
    const response = await axios.get(`${baseUrl}/auth/following/${userId}`);
    return response.data.result;
  }
);


const userSlice = createSlice({
  name: "user",
  initialState: {
    following: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserFollowing.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserFollowing.fulfilled, (state, action) => {
        state.loading = false;
        state.following = action.payload;
      })
      .addCase(fetchUserFollowing.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default userSlice.reducer;
