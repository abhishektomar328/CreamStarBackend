import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Sign up controller
const signup = async (req, res) => {
    try {
        const {email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = new User({ email, password });
        await newUser.save();

        // Create JWT token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, user: { username: newUser.username, email: newUser.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Sign in controller
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, user: { username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Logout controller (invalidate JWT)
const logout = (req, res) => {
    // Typically, logging out means deleting the JWT on the client-side.
    // You can clear it from the client storage, or handle it in the response.
    res.status(200).json({ message: 'Logged out successfully' });
};

export { signup, signin, logout };
