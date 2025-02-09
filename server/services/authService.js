const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

class AuthService {
    generateTokens(userId) {
        const accessToken = jwt.sign(
            { userId },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        return { accessToken, refreshToken };
    }

    async login(email, password) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }

        const { accessToken, refreshToken } = this.generateTokens(user._id);

        // Save refresh token
        await userRepository.deleteToken(user._id, 'refresh');
        await userRepository.saveToken({
            userId: user._id,
            token: refreshToken,
            type: 'refresh',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        });

        return {
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role
            },
            tokens: {
                accessToken,
                refreshToken
            }
        };
    }
}

module.exports = new AuthService(); 