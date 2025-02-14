const borrowRecordRepo = require('../repositories/borrowrecordRepository');
  const Book = require('../models/book');
  const notificationService = require('../services/NotificationService');

  class BorrowRecordService {
    async requestBorrowBook(userId, bookId) {
      const book = await Book.findById(bookId);
      if (!book) throw new Error('Book does not exist');
      if (book.leftBook <= 0) throw new Error('Book is out of stock');

      return await borrowRecordRepo.createBorrowRequest(userId, bookId);
    }

    async approveOrRejectBorrowRequest(id, status) {
      const borrowRequest = await borrowRecordRepo.findBorrowRequestById(id);
      if (!borrowRequest) throw new Error('Request does not exist');

      if (status === 'approved') {
        const book = await Book.findById(borrowRequest.bookId);
        if (!book || book.leftBook <= 0) throw new Error('Cannot approve, book is out of stock');

        book.leftBook -= 1;
        book.borrowBook += 1;
        await book.save();
      }

      const updatedRequest = await borrowRecordRepo.updateBorrowRequestStatus(id, status);

      // Send notification to user
      await notificationService.notifyBorrowStatus(borrowRequest.userId, borrowRequest._id, status);

      return updatedRequest;
    }

    async returnBook(id) {
      const borrowRecord = await borrowRecordRepo.findBorrowRequestById(id);
      if (!borrowRecord || borrowRecord.status !== 'approved') throw new Error('Invalid request');

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

    async getBorrowRecordDetail(borrowRecordId) {
      const borrowRecord = await borrowRecordRepo.getBorrowRecordDetail(borrowRecordId);
      if (!borrowRecord) {
        throw new Error('Borrow request not found.');
      }

      return {
        email: borrowRecord.userId.email,
        bookTitle: borrowRecord.bookId.title,
        borrowDate: borrowRecord.borrowDate,
        dueDate: borrowRecord.dueDate,
        returnDate: borrowRecord.returnDate || 'Not returned',
        status: borrowRecord.status
      };
    }
  }

  module.exports = new BorrowRecordService();