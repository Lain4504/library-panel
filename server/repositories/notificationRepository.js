const Notification = require('../models/Notification');

class NotificationRepository {
  async createNotification(userId, message) {
    const notification = new Notification({ userId, message });
    return await notification.save();
  }

  async getUserNotifications(userId) {
    return await Notification.find({ userId }).sort({ createdAt: -1 });
  }

  async markAsRead(notificationId) {
    return await Notification.findByIdAndUpdate(notificationId, { status: 'read' }, { new: true });
  }
}

module.exports = new NotificationRepository();
