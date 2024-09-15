// In your backend entry point (e.g., index.js or app.js)
import multer from 'multer';
import path from 'path';

// Setup multer for file uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/uploads');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    })
});

// Make sure to use the upload middleware in your routes
import { createUser } from './controller/UserController.js';
app.post('/users', upload.single('image'), createUser);
