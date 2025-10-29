import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {ApiUser, fetchUsers} from '../../services/api';

interface UsersState {
  users: ApiUser[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  isLoading: false,
  error: null,
};

export const loadUsers = createAsyncThunk('users/loadUsers', async () => {
  const users = await fetchUsers();
  return users;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(loadUsers.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(loadUsers.fulfilled, (state, action) => {
          state.users = action.payload;
          state.isLoading = false;
        })
        .addCase(loadUsers.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message || 'Failed to load users';
        });
  },
});

export default usersSlice.reducer;
