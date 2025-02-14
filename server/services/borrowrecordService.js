const borrowRecordRepo = require('../repositories/borrowrecordRepository');
const Book = require('../models/Book');
const notificationService = require('../services/NotificationService');

class BorrowRecordService {
  async requestBorrowBook(userId, bookId) {
    const book = await Book.findById(bookId);
    if (!book) throw new Error('Sách không tồn tại');
    if (book.leftBook <= 0) throw new Error('Sách đã hết');

    return await borrowRecordRepo.createBorrowRequest(userId, bookId);
  }

  async approveOrRejectBorrowRequest(id, status) {
    const borrowRequest = await borrowRecordRepo.findBorrowRequestById(id);
    if (!borrowRequest) throw new Error('Yêu cầu không tồn tại');
  
    if (status === 'approved') {
      const book = await Book.findById(borrowRequest.bookId);
      if (!book || book.leftBook <= 0) throw new Error('Không thể duyệt, sách đã hết');
      
      book.leftBook -= 1;
      book.borrowBook += 1;
      await book.save();
    }
  
    const updatedRequest = await borrowRecordRepo.updateBorrowRequestStatus(id, status);
  
    // Gửi thông báo cho user
    await notificationService.notifyBorrowStatus(borrowRequest.userId, borrowRequest._id, status);
  
    return updatedRequest;
  }

  async returnBook(id) {
    const borrowRecord = await borrowRecordRepo.findBorrowRequestById(id);
    if (!borrowRecord || borrowRecord.status !== 'approved') throw new Error('Yêu cầu không hợp lệ');

    const book = await Book.findById(borrowRecord.bookId);
    if (book) {
      book.leftBook += 1;
      book.borrowBook -= 1;
      await book.save();
    }

    return await borrowRecordRepo.updateReturnDate(id);
  }

  async getUserBorrowHistory(userId) {
    return await borrowRecordRepo.findBorrowRequestsByUser(userId);
  }
}

module.exports = new BorrowRecordService();
