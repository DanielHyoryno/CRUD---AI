import UserList from "./components/UserList.jsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import AddUser from "./components/AddUser.jsx";
import EditUser from "./components/EditUser.jsx";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserList/>}/>
        <Route path="add" element={<AddUser/>}/>
        <Route path="edit/:id" element={<EditUser/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
