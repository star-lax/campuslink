import { findNotificationById, listNotifications, markAllNotificationsRead, markNotificationRead } from './notifications.repository.js';
export const getNotifications = filters => listNotifications(filters);
export const getNotification = id => findNotificationById(id);
export const readNotification = id => markNotificationRead(id);
export const readAllNotifications = () => markAllNotificationsRead();
