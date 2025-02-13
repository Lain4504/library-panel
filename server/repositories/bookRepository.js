const Book = require('../models/Book');

class BookRepository {
  async create(bookData) {
    const book = new Book(bookData);
    return await book.save();
  }

  async findById(bookId) {
    return await Book.findById(bookId);
  }

  async findAll() {
    return await Book.find();
  }

  async update(bookId, updateData) {
    return await Book.findByIdAndUpdate(bookId, updateData, { new: true });
  }

  async delete(bookId) {
    return await Book.findByIdAndDelete(bookId);
  }
  async findAll(page = 1, size = 10, sortField = 'createdAt') {
          const skip = (page - 1) * size;
          
          const [data, total] = await Promise.all([
            Book.find()
                  .sort({ [sortField]: 1 })
                  .skip(skip)
                  .limit(size),
                  Book.countDocuments()
          ]);
  
          return {
              data,
              totalElements: total,
              totalPages: Math.ceil(total / size),
              currentPage: page,
              currentSize: size
          };
      }
}

module.exports = new BookRepository();
