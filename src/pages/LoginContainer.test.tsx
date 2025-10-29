import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { vi, Mock } from "vitest";
import { LoginContainer } from "./LoginContainer";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../store/slices/authSlice";

// 🧩 Mock semua dependency eksternal
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

  it("harus menangani input email & password, lalu dispatch loginUser saat tombol ditekan", async () => {
    // Arrange
    const user = userEvent.setup();
    const mockThunk = vi.fn(() => ({ unwrap: vi.fn() }));
    (loginUser as Mock).mockReturnValue(mockThunk);

    render(<LoginContainer />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /log in/i });

    // Act
    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "secret123");
    await user.click(loginButton);

    // Assert
    expect(mockDispatch).toHaveBeenCalled();
    expect(loginUser).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "secret123",
    });
  });

  it("harus menavigasi ke '/' ketika isAuthenticated = true", () => {
    // Arrange
    (useAppSelector as Mock).mockReturnValueOnce({
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });

    render(<LoginContainer />);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
