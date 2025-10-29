import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type View = 'home' | 'category' | 'thread' | 'leaderboards';

interface UiState {
  currentView: View;
  selectedCategory: string | null;
  searchQuery: string;
}

const initialState: UiState = {
  currentView: 'home',
  selectedCategory: null,
  searchQuery: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentView: (state, action: PayloadAction<View>) => {
      state.currentView = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    navigateToCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      state.currentView = 'category';
    },
    navigateToThread: (state) => {
      state.currentView = 'thread';
    },
    navigateBack: (state) => {
      if (state.currentView === 'thread') {
        state.currentView = 'category';
      } else if (state.currentView === 'category') {
        state.currentView = 'home';
        state.selectedCategory = null;
      }
    },
    navigateToHome: (state) => {
      state.currentView = 'home';
      state.selectedCategory = null;
    },
    navigateToLeaderboards: (state) => {
      state.currentView = 'leaderboards';
    },
  },
});

export const {
  setCurrentView,
  setSelectedCategory,
  setSearchQuery,
  navigateToCategory,
  navigateToThread,
  navigateBack,
  navigateToHome,
  navigateToLeaderboards,
} = uiSlice.actions;

export default uiSlice.reducer;
