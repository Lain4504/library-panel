const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const { sendEmail } = require('../config/sendEmail');
const UserProfileService = require('./userProfileService');
class AuthService {
    #generateAccessToken(userId) {
        return jwt.sign(
            { userId },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );
    }

    #generateRefreshToken(userId) {
        return jwt.sign(
            { userId },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '1d' }
        );
    }


    #generateTokens(userId) {
        const accessToken = this.#generateAccessToken(userId);
        const refreshToken = this.#generateRefreshToken(userId);
        return { accessToken, refreshToken };
    }

    #sendActivationEmail(user, token) {
        console.log('Preparing activation email for user:', {
            username: user.username,
            email: user.email
        });
        
        const activationUrl = `${process.env.CLIENT_URL}/activate/${token}`;
        const message = `Hello ${user.username},\n\nPlease activate your account by clicking the link below:\n\n${activationUrl}\n\nThank you!`;

        sendEmail({
            email: user.email,
            subject: 'Account Activation',
            message
        });
    };

    async login(email, password) {
        const user = await userRepository.findByEmailWithPassword(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Check account status
        if (user.status === 'deleted') {
            throw new Error('This account has been deleted');
        }

        if (user.status === 'inactive') {
            throw new Error('Please activate your account before logging in');
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const { accessToken, refreshToken } = this.#generateTokens(user._id);

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
        let createdUser = null;
        
        try {
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
            createdUser = await userRepository.createUser({
                username,
                email,
                password,
                status: 'inactive'
            });

            // Generate activation token
            const activationToken = this.#generateAccessToken(createdUser._id);

            try {
                // Save activation token with 15 minutes expiry
                await userRepository.saveActivationToken({
                    userId: createdUser._id,
                    token: activationToken,
                    expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
                });

                // Send activation email
                await this.#sendActivationEmail(createdUser, activationToken);

            } catch (error) {
                // If saving token or sending email fails, delete the created user
                if (createdUser) {
                    await userRepository.deleteUser(createdUser._id);
                }
                throw new Error('Failed to complete registration process. Please try again.');
            }

            return {
                user: {
                    id: createdUser._id,
                    email: createdUser.email,
                    username: createdUser.username,
                    role: createdUser.role
                }
            };

        } catch (error) {
            // If any error occurs and user was created, delete it
            if (createdUser) {
                await userRepository.deleteUser(createdUser._id);
            }
            throw error;
        }
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

    async activateAccount(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // If not found, throw error
            const user = await userRepository.findByActivationToken(token);
            if (!user) {
                throw new Error('Invalid activation token');
            }

            // If not match, throw error
            if (decoded.userId.toString() !== user._id.toString()) {
                throw new Error('Invalid activation token');
            }

            // If already activated, throw error
            if (user.status === 'active') {
                throw new Error('Account is already activated');
            }

            // Activate account
            user.status = 'active';
            await user.save();
            await UserProfileService.createUserProfile({ userId: user._id });
            // Remove activation token
            userRepository.removeActivationToken(token);

            return { message: 'Account activated successfully' };
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Activation token has expired');
            }
            if (error.name === 'JsonWebTokenError') {
                throw new Error('Invalid activation token');
            }
            throw error;
        }
    }
}

module.exports = new AuthService(); 