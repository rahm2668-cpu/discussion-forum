import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { loginUser, registerUser } from "./authSlice";
import { login, register, getOwnProfile } from "../../services/api";
import type { ApiUser } from "../../services/api";

// 🧠 Mock localStorage agar tidak error di Node.js
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
});

// 🧠 Mock semua fungsi dari services/api
vi.mock("../../services/api", () => ({
  login: vi.fn(),
  register: vi.fn(),
  getOwnProfile: vi.fn(),
}));

// 🧹 Reset semua mock sebelum setiap test
beforeEach(() => {
  vi.clearAllMocks();
});

describe("authSlice async thunks", () => {
  const mockUser: ApiUser = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "avatar.png",
  };

  it("should login and return token + user when loginUser is fulfilled", async () => {
    (login as Mock).mockResolvedValue("mockToken123");
    (getOwnProfile as Mock).mockResolvedValue(mockUser);

    const thunk = loginUser({ email: "john@example.com", password: "123456" });
    const dispatch = vi.fn();
    const getState = vi.fn();
    const result = await thunk(dispatch, getState, undefined);

    expect(login).toHaveBeenCalledWith({
      email: "john@example.com",
      password: "123456",
    });
    expect(getOwnProfile).toHaveBeenCalledWith("mockToken123");
    expect(result.type).toBe("auth/login/fulfilled");
    expect(result.payload).toEqual({ token: "mockToken123", user: mockUser });
  });

  it("should register and return token + user when registerUser is fulfilled", async () => {
    (register as Mock).mockResolvedValueOnce(undefined);
    (login as Mock).mockResolvedValueOnce("newToken456");
    (getOwnProfile as Mock).mockResolvedValueOnce(mockUser);

    const thunk = registerUser({
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
    });
    const dispatch = vi.fn();
    const getState = vi.fn();
    const result = await thunk(dispatch, getState, undefined);

    expect(register).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
    });
    expect(login).toHaveBeenCalledWith({
      email: "john@example.com",
      password: "123456",
    });
    expect(result.type).toBe("auth/register/fulfilled");
    expect(result.payload).toEqual({ token: "newToken456", user: mockUser });
  });
});
