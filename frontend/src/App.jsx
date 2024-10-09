import UserList from "./components/UserList.jsx";
import AddUser from "./components/AddUser.jsx";
import EditUser from "./components/EditUser.jsx";
import ImageUpload from "./components/ImageUpload.jsx"; // Import the new component
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Set ImageUpload as the default route */}
        <Route path="/" element={<ImageUpload />} />

        {/* Route for UserList */}
        <Route path="users" element={<UserList />} />
        
        {/* Other routes */}
        <Route path="add" element={<AddUser />} />
        <Route path="edit/:id" element={<EditUser />} />
        <Route path="upload" element={<ImageUpload />} /> {/* If you still want /upload to work */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
