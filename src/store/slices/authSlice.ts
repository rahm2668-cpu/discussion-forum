import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  ApiUser,
  login as apiLogin,
  register as apiRegister,
  getOwnProfile,
} from "../../services/api";

export interface AuthState {
  user: ApiUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const loggedInState: AuthState = {
  ...initialState,
  user: {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    avatar: "avatar.png",
  },
  token: "token123",
  isAuthenticated: true,
};

const mockUser = {
  id: "1",
  name: "Alice",
} as ApiUser;

export const loadAuthFromStorage = createAsyncThunk(
  "auth/loadFromStorage",
  async () => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      const profile = await getOwnProfile(storedToken);
      return { token: storedToken, user: profile };
    }
    return null;
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    const token = await apiLogin({ email, password });
    const profile = await getOwnProfile(token);
    localStorage.setItem("auth_token", token);
    return {};
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    await apiRegister({ name, email, password });
    const token = await apiLogin({ email, password });
    const profile = await getOwnProfile(token);
    localStorage.setItem("auth_token", token);
    return { token, user: profile };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("auth_token");
    },
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAuthFromStorage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadAuthFromStorage.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
        state.isLoading = false;
      })
      .addCase(loadAuthFromStorage.rejected, (state) => {
        state.isLoading = false;
        localStorage.removeItem("auth_token");
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Registration failed";
      });
  },
});

export const { logout, clearError, setError } = authSlice.actions;
export default authSlice.reducer;
