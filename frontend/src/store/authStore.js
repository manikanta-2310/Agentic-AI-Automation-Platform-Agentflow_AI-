import { create } from 'zustand';
import { api } from '../lib/api';
import { subscribeToUser } from '../lib/socket';

function safeParseUser(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'string') {
      try { return JSON.parse(parsed); } catch (_) { return { name: parsed }; }
    }
    return parsed;
  } catch (_) {
    return { name: raw };
  }
}

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initialize: async () => {
    if (typeof window === 'undefined') return;
    try {
      const storedToken = localStorage.getItem('agentflow_token');
      const storedUser = localStorage.getItem('agentflow_user');

      if (storedToken) {
        const userObj = safeParseUser(storedUser);
        set({
          token: storedToken,
          user: userObj,
          isAuthenticated: true,
          isLoading: false
        });

        // Refresh user profile in background
        try {
          const res = await api.getMe();
          if (res.success && res.data) {
            set({ user: res.data });
            localStorage.setItem('agentflow_user', JSON.stringify(res.data));
            if (res.data.id || res.data._id) {
              subscribeToUser(res.data.id || res.data._id);
            }
          }
        } catch (e) {
          console.warn('[AuthStore] Session verification failed, clearing');
          get().logout();
        }
      } else {
        set({ isLoading: false, isAuthenticated: false });
      }
    } catch (err) {
      get().logout();
    }
  },

  login: async (emailOrCredentials, maybePassword) => {
    set({ isLoading: true, error: null });
    try {
      const payload = typeof emailOrCredentials === 'object'
        ? emailOrCredentials
        : { email: emailOrCredentials, password: maybePassword };

      const res = await api.login(payload);
      if (res.success && res.data) {
        const { user, token } = res.data;
        localStorage.setItem('agentflow_token', token);
        localStorage.setItem('agentflow_user', JSON.stringify(user));
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        if (user.id || user._id) {
          subscribeToUser(user.id || user._id);
        }
        return { success: true };
      }
      throw new Error(res.message || 'Login failed');
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Authentication failed';
      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  register: async (nameOrUserData, maybeEmail, maybePassword, maybeRole) => {
    set({ isLoading: true, error: null });
    try {
      const payload = typeof nameOrUserData === 'object'
        ? nameOrUserData
        : { name: nameOrUserData, email: maybeEmail, password: maybePassword, role: maybeRole || 'operator' };

      const res = await api.register(payload);
      if (res.success && res.data) {
        const { user, token } = res.data;
        localStorage.setItem('agentflow_token', token);
        localStorage.setItem('agentflow_user', JSON.stringify(user));
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        if (user.id || user._id) {
          subscribeToUser(user.id || user._id);
        }
        return { success: true };
      }
      throw new Error(res.message || 'Registration failed');
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Registration failed';
      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agentflow_token');
      localStorage.removeItem('agentflow_user');
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  },

  clearError: () => set({ error: null })
}));
