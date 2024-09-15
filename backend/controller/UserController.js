// controllers/UserController.js
import User from "../models/UserModel.js";
import multer from 'multer';
import path from 'path';

// Configure Multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Directory for storing uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // File name format
    }
});

const upload = multer({ storage: storage });


// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { id: req.params.id }
        });
        res.status(200).json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};

// Create a new user with image upload
export const createUser = async (req, res) => {
    try {
        const { name, email, gender } = req.body;
        const image = req.file ? req.file.filename : null; // Extract only the file name

        const newUser = await User.create({
            name,
            email,
            gender,
            image // Store only the filename as a string
        });

        res.status(201).json({ msg: "User created", data: newUser });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

// Update user with optional image upload
export const updateUser = async (req, res) => {
    try {
        const { name, email, gender } = req.body;
        let image = null;

        if (req.file) {
            image = req.file.filename; // Store just the filename
        }

        await User.update(
            {
                name,
                email,
                gender,
                ...(image && { image }) // Update image only if a new one is provided
            },
            {
                where: { id: req.params.id }
            }
        );

        res.status(200).json({ msg: "User updated" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
    try {
        await User.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({ msg: "User deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};

// Export the 'upload' middleware
export { upload };
