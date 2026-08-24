const notificationService = require('../services/notificationService');

async function list(req, res, next) {
  try {
    const unreadOnly = req.query.unreadOnly === 'true';
    const limit = parseInt(req.query.limit, 10) || 30;
    const notifications = await notificationService.getUserNotifications(req.user.id, { unreadOnly, limit });
    res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
}

async function markRead(req, res, next) {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
}

async function markAllRead(req, res, next) {
  try {
    await notificationService.markAllAsRead(req.user.id);
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  markRead,
  markAllRead
};
