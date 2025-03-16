const BorrowRecord = require('../models/borrowRecord');

class BorrowRecordRepository {
    async createBorrowRequest(userId, bookId, returnDate) {
        if (!userId || !bookId || !returnDate) {
            throw new Error('Missing required parameters');
        }

        try {
            const borrowRequest = new BorrowRecord({ userId, bookId, status: 'pending', returnDate });
            return await borrowRequest.save();
        } catch (error) {
            throw new Error(`Error creating borrow request: ${error.message}`);
        }
    }

    async findBorrowRequestById(id) {
        return BorrowRecord.findById(id);
    }

    async findBorrowRequestsByUser(userId) {
        return BorrowRecord.find({userId}).populate('bookId', 'title author').sort({createdAt: -1});
    }

    async updateBorrowRequestStatus(id, status) {
        return BorrowRecord.findByIdAndUpdate(id, {status}, {new: true});
    }

    async updateReturnDate(id) {
        return BorrowRecord.findByIdAndUpdate(id, {status: 'returned', returnDate: new Date()}, {new: true});
    }

    async getBorrowRecordDetail(borrowRecordId) {
        return await BorrowRecord.findById(borrowRecordId)
            .populate('userId', 'email') // Get email from User collection
            .populate('bookId', 'title') // Get title from Book collection
            .exec();
    }

    async findBorrowsDueInTwoDays() {
        const today = new Date();
        const twoDaysFromNow = new Date(today);
        twoDaysFromNow.setDate(today.getDate() + 2);

        return BorrowRecord.find({
            returnDate: {
                $gte: today,
                $lt: twoDaysFromNow
            },
            status: 'approved'
        });
    }
}

module.exports = new BorrowRecordRepository();
