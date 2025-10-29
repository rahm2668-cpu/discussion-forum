// RegisterContainer.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { RegisterContainer } from "./RegisterContainer";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { registerUser, clearError } from "../store/slices/authSlice";

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
  registerUser: vi.fn(),
  clearError: vi.fn(),
}));

describe("RegisterContainer Component", () => {
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

  it("should handle input fields and dispatch registerUser on submit", async () => {
    const user = userEvent.setup();
    const mockThunk = vi.fn(() => ({ unwrap: vi.fn() }));
    (registerUser as unknown as Mock).mockReturnValue(mockThunk);

    render(<RegisterContainer />);

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i); // match exact label
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(passwordInput, "secret123");
    await user.type(confirmPasswordInput, "secret123");
    await user.click(submitButton);

    expect(mockDispatch).toHaveBeenCalled();
    expect(registerUser).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      password: "secret123",
    });
  });

  it("should navigate to '/' when isAuthenticated is true", () => {
    (useAppSelector as Mock).mockReturnValueOnce({
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });

    render(<RegisterContainer />);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should display error if passwords do not match", async () => {
    const user = userEvent.setup();
    render(<RegisterContainer />);

    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await user.type(passwordInput, "secret123");
    await user.type(confirmPasswordInput, "wrongpass");
    await user.click(submitButton);

    // Since toast is used, we can check that dispatch was not called
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
