import User from '../models/userModel.js'
import axios from 'axios'

export const login = (req, res) => {
    const redirectUri = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_OAUTH_CLIENT_ID}&scope=repo,user`;
    res.redirect(redirectUri);
}

// Callback function to handle GitHub's response after authorization
export const callback = async (req, res) => {
    const { code } = req.query;

    try {
        // Exchange the code for an access token
        const response = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
            client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
            code: code,
        }, {
            headers: {
                Accept: 'application/json',
            },
        });

        const accessToken = response.data.access_token;

        // Use the access token to fetch user information
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        });

        // Find or create the user in your database
        const userData = userResponse.data;
        let user = await User.findOne({ githubId: userData.id });

        if (!user) {
            // Create a new user if not found
            user = new User({
                githubId: userData.id,
                username: userData.login,
                email: userData.email || `${userData.login}@users.noreply.github.com`,
                avatarUrl: userData.avatar_url,
            });
            await user.save();
        }

        // Store user information in the session (or any session management)
        req.session.userId = user._id; // Store user ID in session
        req.session.accessToken = accessToken; // Optionally store access token if needed

        // Redirect to a secure area of your app (e.g., dashboard)
        res.redirect('/auth/safe'); // frontend's safe url
    } catch (error) {
        console.error('Error during GitHub authentication:', error);
        res.status(500).send('Authentication failed.');
    }
};

// Logout function to destroy the session
export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).send('Could not log out.');
        }
        res.redirect('/'); // Redirect to frontend's homepage after logout
    });
};
