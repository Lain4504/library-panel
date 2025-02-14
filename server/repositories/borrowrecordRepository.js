const BorrowRecord = require('../models/BorrowRecord');

class BorrowRecordRepository {
  async createBorrowRequest(userId, bookId) {
    const borrowRequest = new BorrowRecord({ userId, bookId, status: 'pending' });
    return await borrowRequest.save();
  }

  async findBorrowRequestById(id) {
    return await BorrowRecord.findById(id);
  }

  async findBorrowRequestsByUser(userId) {
    return await BorrowRecord.find({ userId }).populate('bookId', 'title author').sort({ createdAt: -1 });
  }

  async updateBorrowRequestStatus(id, status) {
    return await BorrowRecord.findByIdAndUpdate(id, { status }, { new: true });
  }

  async updateReturnDate(id) {
    return await BorrowRecord.findByIdAndUpdate(id, { status: 'returned', returnDate: new Date() }, { new: true });
  }
  async getBorrowRecordDetail(borrowRecordId) {
    return await BorrowRecord.findById(borrowRecordId)
      .populate('userId', 'email') // Lấy email từ bảng User
      .populate('bookId', 'title') // Lấy title từ bảng Book
      .exec();
  }
}

module.exports = new BorrowRecordRepository();
