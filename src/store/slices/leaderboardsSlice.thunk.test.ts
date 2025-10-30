import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import reducer, { loadLeaderboards } from "./leaderboardsSlice";
import { fetchLeaderboards } from "../../services/api";
import type { LeaderboardUser } from "../../services/api";

// 🧠 Mock the fetchLeaderboards API function for controlled testing
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

  // 🧹 Clear all mocks before each test to avoid leftover state
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle fulfilled case when API returns data", async () => {
    // 🔧 Arrange: set up the mock response
    (fetchLeaderboards as Mock).mockResolvedValue(mockLeaderboards);

    // ▶️ Act: dispatch the thunk
    const thunk = loadLeaderboards();
    const dispatch = vi.fn();
    const getState = vi.fn();
    const result = await thunk(dispatch, getState, undefined);

    // ✅ Assert: verify the thunk called API and returned expected payload
    expect(fetchLeaderboards).toHaveBeenCalled();
    expect(result.type).toBe("leaderboards/loadLeaderboards/fulfilled");
    expect(result.payload).toEqual(mockLeaderboards);
  });

  it("should handle rejected case when API fails", async () => {
    // 🔧 Arrange: set up the mock to throw an error
    (fetchLeaderboards as Mock).mockRejectedValue(new Error("Network error"));

    // ▶️ Act: dispatch the thunk
    const thunk = loadLeaderboards();
    const dispatch = vi.fn();
    const getState = vi.fn();
    const result = await thunk(dispatch, getState, undefined);

    // ✅ Assert: verify the thunk called API and returned an error
    expect(fetchLeaderboards).toHaveBeenCalled();
    expect(result.type).toBe("leaderboards/loadLeaderboards/rejected");
    expect((result as { error?: { message: string } }).error?.message).toBe(
      "Network error"
    );
  });
});
