import UserList from "./components/UserList.jsx";
import AddUser from "./components/AddUser.jsx";
import EditUser from "./components/EditUser.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/users" element={<UserList />} /> {/* Add leading slash */}
        <Route path="/add" element={<AddUser />} /> {/* Add leading slash */}
        <Route path="/users/edit/:id" element={<EditUser />} /> {/* Add leading slash */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;