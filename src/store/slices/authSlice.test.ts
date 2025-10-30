import { vi, describe, it, expect, beforeAll } from "vitest";
import authReducer, { logout, clearError } from "./authSlice";

beforeAll(() => {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(global, "localStorage", { value: localStorageMock });
});

describe("authSlice reducer", () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  };

  it("should clear user data when logout is called", () => {
    // Arrange
    const loggedInState = {
      ...initialState,
      user: { id: "1", name: "Test User", avatar: "avatar.png" },
      token: "token123",
      isAuthenticated: true,
    };
    // Action
    const nextState = authReducer(loggedInState, logout());
    // Assert
    expect(nextState.user).toBeNull();
    expect(nextState.token).toBeNull();
    expect(nextState.isAuthenticated).toBe(false);
    expect(localStorage.removeItem).toHaveBeenCalledWith("auth_token");
  });

  it("should clear error when clearError is called", () => {
    // Arrange
    const errorState = {
      ...initialState,
      error: "Some error occurred",
    };
    // Action
    const nextState = authReducer(errorState, clearError());
    // Assert
    expect(nextState.error).toBeNull();
  });
});
