import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';

interface AuthState { user: User | null; accessToken: string | null; refreshToken: string | null }

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, accessToken: null, refreshToken: null } as AuthState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User; access: string; refresh: string }>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', action.payload.access);
        localStorage.setItem('refresh_token', action.payload.refresh);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    logout(state) {
      state.user = null; state.accessToken = null; state.refreshToken = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
      }
    },
    loadFromStorage(state) {
      if (typeof window !== 'undefined') {
        const access = localStorage.getItem('access_token');
        const refresh = localStorage.getItem('refresh_token');
        const u = localStorage.getItem('user');
        if (access && refresh && u) {
          try { state.user = JSON.parse(u); state.accessToken = access; state.refreshToken = refresh; } catch { /* skip */ }
        }
      }
    },
  },
});

export const { setCredentials, logout, loadFromStorage } = authSlice.actions;
export default authSlice.reducer;
