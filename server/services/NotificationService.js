const notificationRepo = require('../repositories/notificationRepository');
const borrowRecordRepo = require('../repositories/borrowrecordRepository');

class NotificationService {
  async notifyBorrowStatus(userId, borrowRecordId, status) {
    let message = '';
    switch (status) {
      case 'approved':
        message = 'Yêu cầu mượn sách của bạn đã được chấp nhận!';
        break;
      case 'rejected':
        message = 'Yêu cầu mượn sách của bạn đã bị từ chối.';
        break;
      case 'returned':
        message = 'Bạn đã trả sách thành công!';
        break;
      default:
        message = 'Trạng thái yêu cầu mượn sách đã được cập nhật.';
    }

    return await notificationRepo.createNotification(userId, message);
  }

  async sendReminder(userId, borrowRecordId) {
    const borrowRecord = await borrowRecordRepo.findBorrowRequestById(borrowRecordId);
    if (!borrowRecord || borrowRecord.status !== 'approved') return;

    const dueDate = new Date(borrowRecord.dueDate);
    const today = new Date();
    const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (daysLeft === 3) {
      return await notificationRepo.createNotification(userId, 'Còn 3 ngày nữa để trả sách, vui lòng kiểm tra lại thời gian.');
    } else if (daysLeft === 1) {
      return await notificationRepo.createNotification(userId, 'Ngày mai là hạn trả sách, đừng quên nhé!');
    } else if (daysLeft < 0) {
      return await notificationRepo.createNotification(userId, 'Bạn đã quá hạn trả sách, vui lòng trả ngay để tránh bị phạt!');
    }
  }

  async getUserNotifications(userId) {
    return await notificationRepo.getUserNotifications(userId);
  }

  async markNotificationAsRead(notificationId) {
    return await notificationRepo.markAsRead(notificationId);
  }
}

module.exports = new NotificationService();
