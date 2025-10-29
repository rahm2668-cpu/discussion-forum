import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LeaderboardUser, fetchLeaderboards } from "../../services/api";

interface LeaderboardsState {
  leaderboards: LeaderboardUser[];
  isLoading: boolean;
  error: string | null;
}

const initialState: LeaderboardsState = {
  leaderboards: [],
  isLoading: false,
  error: null,
};

export const loadLeaderboards = createAsyncThunk(
  "leaderboards/loadLeaderboards",
  async () => {
    const leaderboards = await fetchLeaderboards();
    console.log("API leaderboards:", leaderboards); // <- debug
    return leaderboards;
  }
);

const leaderboardsSlice = createSlice({
  name: "leaderboards",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadLeaderboards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadLeaderboards.fulfilled, (state, action) => {
        state.leaderboards = action.payload;
        state.isLoading = false;
      })
      .addCase(loadLeaderboards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to load leaderboards";
      });
  },
});

export default leaderboardsSlice.reducer;
