const User = require('../models/User');
const UserToken = require('../models/UserToken');

class UserRepository {
    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async createUser(userData) {
        return await User.create(userData);
    }

    async saveToken(tokenData) {
        return await UserToken.create(tokenData);
    }

    async findTokenByUserId(userId, type) {
        return await UserToken.findOne({ userId, type });
    }

    async deleteToken(userId, type) {
        return await UserToken.deleteOne({ userId, type });
    }
}

module.exports = new UserRepository(); 