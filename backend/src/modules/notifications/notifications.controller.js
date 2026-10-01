import { getNotification, getNotifications, readAllNotifications, readNotification } from './notifications.service.js';
export const listNotificationsController = filters => getNotifications(filters);
export const getNotificationController = id => getNotification(id);
export const markNotificationReadController = id => readNotification(id);
export const markAllNotificationsReadController = () => readAllNotifications();
