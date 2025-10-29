import { describe, it, expect } from "vitest";
import leaderboardsReducer, { loadLeaderboards } from "./leaderboardsSlice";

describe("leaderboardsSlice reducer", () => {
  const initialState = {
    leaderboards: [],
    isLoading: false,
    error: null,
  };

  it("should return the initial state when given an unknown action", () => {
    const action = { type: "UNKNOWN" };
    const nextState = leaderboardsReducer(undefined, action);
    expect(nextState).toEqual(initialState);
  });

  it("should set isLoading true when loadLeaderboards.pending", () => {
    const action = { type: loadLeaderboards.pending.type };
    const nextState = leaderboardsReducer(initialState, action);

    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it("should update leaderboards and set isLoading false when loadLeaderboards.fulfilled", () => {
    const mockLeaderboards = [
      { user: { id: "1", name: "Alice", avatar: "a.png" }, score: 120 },
      { user: { id: "2", name: "Bob", avatar: "b.png" }, score: 100 },
    ];

    const action = {
      type: loadLeaderboards.fulfilled.type,
      payload: mockLeaderboards,
    };

    const nextState = leaderboardsReducer(initialState, action);

    expect(nextState.leaderboards).toEqual(mockLeaderboards);
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBeNull();
  });

  it("should set error when loadLeaderboards.rejected", () => {
    const action = {
      type: loadLeaderboards.rejected.type,
      error: { message: "Failed to fetch" },
    };

    const nextState = leaderboardsReducer(initialState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe("Failed to fetch");
  });
});
