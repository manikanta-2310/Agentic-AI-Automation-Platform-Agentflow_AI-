import { create } from 'zustand';
import { api } from '../lib/api';
import { getSocket } from '../lib/socket';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isOpen: false,
  isLoading: false,

  setOpen: (isOpen) => set({ isOpen }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const res = await api.getNotifications();
      if (res.success && res.data) {
        const notifications = res.data;
        const unreadCount = notifications.filter((n) => !n.isRead).length;
        set({ notifications, unreadCount, isLoading: false });
      }
    } catch (err) {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await api.markNotificationRead(id);
      set((state) => {
        const updated = state.notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n));
        return {
          notifications: updated,
          unreadCount: updated.filter((n) => !n.isRead).length
        };
      });
    } catch (err) {
      console.error('Mark notification read failed:', err);
    }
  },

  markAllAsRead: async () => {
    try {
      await api.markAllNotificationsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0
      }));
    } catch (err) {
      console.error('Mark all read failed:', err);
    }
  },

  listenForNewNotifications: () => {
    const socket = getSocket();
    if (!socket) return;

    socket.off('notification:new');
    socket.on('notification:new', (notification) => {
      set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1
      }));
    });
  }
}));
