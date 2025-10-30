import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { LoginContainer } from "./LoginContainer";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { loginUser, setError } from "../store/slices/authSlice";

// 🧩 Mock external dependencies
vi.mock("../store/hooks", () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("../store/slices/authSlice", () => ({
  loginUser: vi.fn(),
  clearError: vi.fn(),
  setError: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("LoginContainer Component", () => {
  const mockDispatch = vi.fn();
  const mockNavigate = vi.fn();

  // 🧹 Reset mocks and set default hook return values before each test
  beforeEach(() => {
    vi.clearAllMocks();
    (useAppDispatch as Mock).mockReturnValue(mockDispatch);
    (useNavigate as Mock).mockReturnValue(mockNavigate);
    (useAppSelector as Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  it("should handle email & password input and dispatch loginUser when button clicked", async () => {
    // 🔧 Arrange: set up userEvent and mock thunk
    const user = userEvent.setup();
    const mockThunk = vi.fn(() => ({ unwrap: vi.fn() }));
    (loginUser as unknown as Mock).mockReturnValue(mockThunk);

    // ▶️ Act: render component and fill inputs
    render(<LoginContainer />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /log in/i });

    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "secret123");
    await user.click(loginButton);

    // ✅ Assert: dispatch and loginUser called with correct payload
    expect(mockDispatch).toHaveBeenCalled();
    expect(loginUser).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "secret123",
    });
  });

  it("should navigate to '/' when isAuthenticated is true", () => {
    // 🔧 Arrange: set selector to authenticated state
    (useAppSelector as Mock).mockReturnValueOnce({
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });

    // ▶️ Act: render component
    render(<LoginContainer />);

    // ✅ Assert: navigate called to home page
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should show error message if email or password is empty", async () => {
    // 🔧 Arrange: setup userEvent
    const user = userEvent.setup();

    // ▶️ Act: render component and click login without filling inputs
    render(<LoginContainer />);
    const loginButton = screen.getByRole("button", { name: /log in/i });
    await user.click(loginButton);

    // ✅ Assert: check validation error messages
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });
});
