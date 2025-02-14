const Author = require('../models/Author');

// Repository to manage Author operations
const authorRepository = {
  create: async (data) => {
    return Author.create(data);
  },
  findAll: async () => {
    return Author.find().populate('publisher');
  },
  findById: async (id) => {
    return Author.findById(id).populate('publisher');
  },
  update: async (id, data) => {
    return Author.findByIdAndUpdate(id, data, { new: true });
  },
  delete: async (id) => {
    return Author.findByIdAndDelete(id);
  },
};

module.exports = authorRepository;