const notificationRepo = require('../repositories/notificationRepository');
const borrowRecordRepo = require('../repositories/borrowrecordRepository');
const bookRepo = require('../repositories/bookRepository'); 

class NotificationService {
  async notifyBorrowStatus(userId, borrowRecordId, status) {
    const borrowRecord = await borrowRecordRepo.findBorrowRequestById(borrowRecordId);
    if (!borrowRecord) return;

    const book = await bookRepo.findBookById(borrowRecord.bookId);
    const bookTitle = book ? book.title : 'một cuốn sách';

    let message = '';
    switch (status) {
      case 'approved':
        message = `Yêu cầu mượn sách "${bookTitle}" của bạn đã được chấp nhận!`;
        break;
      case 'rejected':
        message = `Yêu cầu mượn sách "${bookTitle}" của bạn đã bị từ chối.`;
        break;
      case 'returned':
        message = `Bạn đã trả sách "${bookTitle}" thành công!`;
        break;
      default:
        message = `Trạng thái yêu cầu mượn sách "${bookTitle}" đã được cập nhật.`;
    }

    return await notificationRepo.createNotification(userId, message);
  }

  async sendReminder(userId, borrowRecordId) {
    const borrowRecord = await borrowRecordRepo.findBorrowRequestById(borrowRecordId);
    if (!borrowRecord || borrowRecord.status !== 'approved') return;

    const book = await bookRepo.findBookById(borrowRecord.bookId);
    const bookTitle = book ? book.title : 'một cuốn sách';

    const dueDate = new Date(borrowRecord.dueDate);
    const today = new Date();
    const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    let message = '';
    if (daysLeft === 3) {
      message = `Còn 3 ngày nữa để trả sách "${bookTitle}". Vui lòng kiểm tra lại thời gian.`;
    } else if (daysLeft === 1) {
      message = `Ngày mai là hạn trả sách "${bookTitle}", đừng quên nhé!`;
    } else if (daysLeft < 0) {
      message = `Bạn đã quá hạn trả sách "${bookTitle}". Vui lòng trả ngay để tránh bị phạt!`;
    }

    if (message) {
      return await notificationRepo.createNotification(userId, message);
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
