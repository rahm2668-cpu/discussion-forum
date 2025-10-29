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
    const user = userEvent.setup();
    const mockThunk = vi.fn(() => ({ unwrap: vi.fn() }));
    (loginUser as unknown as Mock).mockReturnValue(mockThunk);

    render(<LoginContainer />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /log in/i });

    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "secret123");
    await user.click(loginButton);

    expect(mockDispatch).toHaveBeenCalled();
    expect(loginUser).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "secret123",
    });
  });

  it("should navigate to '/' when isAuthenticated is true", () => {
    (useAppSelector as Mock).mockReturnValueOnce({
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });

    render(<LoginContainer />);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should show error message if email or password is empty", async () => {
    const user = userEvent.setup();

    render(<LoginContainer />);

    const loginButton = screen.getByRole("button", { name: /log in/i });

    // Click login without filling inputs
    await user.click(loginButton);

    // Check for validation error messages
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });
});
