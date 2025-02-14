const borrowRecordService = require('../services/borrowrecordService');

class BorrowRecordController {
  async requestBorrowBook(req, res) {
    try {
      const { userId, bookId } = req.body;
      const result = await borrowRecordService.requestBorrowBook(userId, bookId);
      res.status(201).json({ message: 'Yêu cầu mượn sách đã được gửi', result });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async approveOrRejectBorrowRequest(req, res) {
    try {
      const { status } = req.body;
      const result = await borrowRecordService.approveOrRejectBorrowRequest(req.params.id, status);
      res.status(200).json({ message: `Yêu cầu đã được cập nhật thành ${status}`, result });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async returnBook(req, res) {
    try {
      const result = await borrowRecordService.returnBook(req.params.id);
      res.status(200).json({ message: 'Sách đã được trả', result });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getUserBorrowHistory(req, res) {
    try {
      const result = await borrowRecordService.getUserBorrowHistory(req.params.userId);
      res.status(200).json({ history: result });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new BorrowRecordController();
