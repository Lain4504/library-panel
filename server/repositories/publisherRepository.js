const Publisher = require('../models/Publisher');

// Repository to manage Publisher operations
const publisherRepository = {
    create: async (data) => {
        return Publisher.create(data);
    },
    findAll: async () => {
        return Publisher.find();
    },
    findById: async (id) => {
        return Publisher.findById(id);
    },
    update: async (id, data) => {
        return Publisher.findByIdAndUpdate(id, data, { new: true });
    },
    delete: async (id) => {
        return Publisher.findByIdAndDelete(id);
    },
};

module.exports = publisherRepository;