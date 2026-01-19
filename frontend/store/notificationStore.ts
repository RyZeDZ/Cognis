// frontend/store/notificationStore.ts
import { create } from "zustand";
import type { Notification } from "@/types";

type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (data: {
    notifications: Notification[];
    unread_count: number;
  }) => void;
  markAllAsRead: () => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (data) =>
    set({
      notifications: data.notifications,
      unreadCount: data.unread_count,
    }),
  markAllAsRead: () =>
    set((state) => ({
      // Optimistically update the UI without waiting for the API
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
      unreadCount: 0,
    })),
}));
