const Notification = require('../models/Notification');
const { emitUserEvent } = require('../config/socket');

async function createNotification({ ownerId, workflowId = null, executionId = null, type = 'info', title, message }) {
  const notification = await Notification.create({
    owner: ownerId,
    workflow: workflowId,
    execution: executionId,
    type,
    title,
    message,
    isRead: false
  });

  emitUserEvent(ownerId, 'notification:new', notification);
  return notification;
}

async function getUserNotifications(ownerId, { limit = 30, unreadOnly = false } = {}) {
  const query = { owner: ownerId };
  if (unreadOnly) {
    query.isRead = false;
  }

  return Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('workflow', 'name')
    .lean();
}

async function markAsRead(notificationId, ownerId) {
  return Notification.findOneAndUpdate(
    { _id: notificationId, owner: ownerId },
    { isRead: true },
    { new: true }
  );
}

async function markAllAsRead(ownerId) {
  return Notification.updateMany({ owner: ownerId, isRead: false }, { isRead: true });
}

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead
};
