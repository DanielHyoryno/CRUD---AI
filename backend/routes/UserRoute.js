import express from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser, upload } from "../controller/UserController.js";

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', upload.single('image'), createUser);  // Use 'upload' middleware for image upload
router.patch('/users/:id', upload.single('image'), updateUser);  // Use 'upload' middleware for image upload in updates
router.delete('/users/:id', deleteUser);

export default router;
