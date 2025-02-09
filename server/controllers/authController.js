const authService = require('../services/authService');

class AuthController {
    // Register new user
    async register(req, res) {
        try {
            const { username, email, password } = req.body;
            
            const { user, tokens } = await authService.register(username, email, password);
            
            res.status(201).json({
                user,
                tokens
            });
        } catch (error) {
            res.status(400).json({ 
                message: error.message || 'Error creating user'
            });
        }
    }

    // Login user
    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            const { user, tokens } = await authService.login(email, password);
            
            res.json({
                user,
                tokens
            });
        } catch (error) {
            res.status(401).json({ 
                message: error.message || 'Error logging in'
            });
        }
    }

    async getMyInfo(req, res) {
        try {
            const user = await authService.getMyInfo(req.user.id);
            res.json({ user });
        } catch (error) {
            res.status(400).json({ 
                message: error.message || 'Error getting user info'
            });
        }
    }
}

module.exports = new AuthController(); 