import UserList from "./components/UserList.jsx";
import AddUser from "./components/AddUser.jsx";
import EditUser from "./components/EditUser.jsx";
import HospitalLayout from "./components/HospitalLayout.jsx"; // Import the new layout component
import { BrowserRouter, Routes, Route } from "react-router-dom";
import '../index.css'; // Ensure this line is present

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HospitalLayout />}> {/* Use HospitalLayout for consistent layout */}
          <Route index element={<UserList />} /> {/* Default route */}
          <Route path="add" element={<AddUser />} /> {/* Add User route */}
          <Route path="/edit/:id" element={<EditUser />} /> {/* Edit User route */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;