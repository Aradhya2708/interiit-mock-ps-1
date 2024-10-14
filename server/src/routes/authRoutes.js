import express from 'express';
// import controllers
import { login, callback, logout } from '../controllers/authController.js';
import User from '../models/userModel.js'

const router = express.Router();

router.get(`/github`, login); // Github OAuth 

router.get(`/github/callback`, callback);

router.get(`/logout`, logout);

// debug route
router.get('/safe', async (req, res) => {
    // Check if user is logged in
    if (!req.session.userId) {
        return res.status(401).send('You are not logged in.');
    }

    // Find the user by ID
    const user = await User.findById(req.session.userId);

    if (!user) {
        return res.status(404).send('User not found.');
    }

    // Render a message with the user's username
    res.send(`Hey, you are ${user.username}!`); // Display a simple message
});

export default router;