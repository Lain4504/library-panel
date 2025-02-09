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
            { expiresIn: '1d' }
        );

        return { accessToken, refreshToken };
    }

    async login(email, password) {
        const user = await userRepository.findByEmailWithPassword(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const { accessToken, refreshToken } = this.generateTokens(user._id);

        // Save tokens
        await userRepository.saveToken({
            userId: user._id,
            accessToken,
            refreshToken
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

    async register(username, email, password) {
        // Check if user already exists
        const existingEmail = await userRepository.findByEmail(email);
        const existingUsername = await userRepository.findByUsername(username);

        if (existingEmail) {
            throw new Error('User already exists with this email');
        }

        if (existingUsername) {
            throw new Error('Username is already taken');
        }

        // Create new user
        const user = await userRepository.createUser({
            username,
            email,
            password
        });

        return {
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role
            }
        };
    }

    async getMyInfo(userId) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        
        return {
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role
        };
    }
}

module.exports = new AuthService(); 