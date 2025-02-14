const notificationService = require('../services/NotificationService');

class NotificationController {
  async getUserNotifications(req, res) {
    try {
      const notifications = await notificationService.getUserNotifications(req.params.userId);
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async markNotificationAsRead(req, res) {
    try {
      const result = await notificationService.markNotificationAsRead(req.params.id);
      res.status(200).json({ message: 'Thông báo đã được đánh dấu là đã đọc.', result });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new NotificationController();
