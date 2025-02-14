const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
    },
    publisher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Publisher',
    },
}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema);