import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use User routes
app.use(UserRoute);

app.listen(5000, () => console.log('Server is up and running on port 5000..'));
