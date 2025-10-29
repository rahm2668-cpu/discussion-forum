import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import reducer, { loadLeaderboards } from "./leaderboardsSlice";
import { fetchLeaderboards } from "../../services/api";
import type { LeaderboardUser } from "../../services/api";

vi.mock("../../services/api", () => ({
  fetchLeaderboards: vi.fn(),
}));

describe("leaderboardsSlice thunk function", () => {
  const mockLeaderboards: LeaderboardUser[] = [
    {
      id: "1",
      name: "Alice",
      email: "alice@mail.com",
      avatar: "a.png",
      score: 120,
    },
    { id: "2", name: "Bob", email: "bob@mail.com", avatar: "b.png", score: 90 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle fulfilled case when API returns data", async () => {
    (fetchLeaderboards as Mock).mockResolvedValue(mockLeaderboards);

    const thunk = loadLeaderboards();
    const dispatch = vi.fn();
    const getState = vi.fn();
    const result = await thunk(dispatch, getState, undefined);

    expect(fetchLeaderboards).toHaveBeenCalled();
    expect(result.type).toBe("leaderboards/loadLeaderboards/fulfilled");
    expect(result.payload).toEqual(mockLeaderboards);
  });

  it("should handle rejected case when API fails", async () => {
    (fetchLeaderboards as Mock).mockRejectedValue(new Error("Network error"));

    const thunk = loadLeaderboards();
    const dispatch = vi.fn();
    const getState = vi.fn();
    const result = await thunk(dispatch, getState, undefined);

    expect(fetchLeaderboards).toHaveBeenCalled();
    expect(result.type).toBe("leaderboards/loadLeaderboards/rejected");
    expect(result.error?.message).toBe("Network error");
  });
});
