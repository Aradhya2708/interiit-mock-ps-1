import User from '../models/userModel.js'
import axios from 'axios'
import path from 'path';

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

        const userData = userResponse.data;

        // Check if user already exists in the database
        let user = await User.findOne({ githubId: userData.id });

        if (user) {
            // If user exists, log them in by storing their ID in session
            req.session.userId = user._id;
            req.session.accessToken = accessToken;
            return res.redirect('/auth/safe'); // Redirect to a secure area after successful login
        } else {
            // If user doesn't exist, store GitHub user data in session and redirect to enter-wallet
            req.session.githubUser = {
                githubId: userData.id,
                username: userData.login,
                email: userData.email || `${userData.login}@users.noreply.github.com`,
                avatarUrl: userData.avatar_url,
            };
            req.session.accessToken = accessToken; // Store access token for later use
            return res.redirect('/auth/enter-wallet');
        }
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

const __dirname = path.resolve();

// Serve the enter-wallet HTML page
export const renderWalletPage = (req, res) => {
    // Check if GitHub user data is present in the session
    if (!req.session.githubUser) {
        return res.redirect('/'); // Redirect to home if no GitHub data found
    }

    // Serve the wallet entry page
    res.sendFile(path.join(__dirname, '/src/views/enter-wallet.html')); // Adjust path as per your structure
};

export const addWallet = async (req, res) => {
    // console.log(req.body);
    const { walletAddress } = req.body;

    if (!req.session.githubUser) {
        return res.status(400).send('No GitHub user data found in session.');
    }

    try {
        const githubUser = req.session.githubUser;

        // Create a new user in the database
        const user = new User({
            githubId: githubUser.githubId,
            username: githubUser.username,
            email: githubUser.email,
            avatarUrl: githubUser.avatarUrl,
            walletAddress: walletAddress,
        });

        await user.save();

        req.session.userId = user._id;
        req.session.githubUser = null;

        res.status(201).send('User created successfully.');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user.');
    }
}