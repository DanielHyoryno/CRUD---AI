import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserList = () => {
    const [users, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/get');            
            console.log(response.data);  // Log the response data
            setUser(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to load users.');
            setLoading(false);
        }
    };
    
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/delete/${id}/`);
            console.log("Delete response:", response.data); // Log the response
            // Update the state to remove the deleted user
            getUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    // Error Handling for Image
    const handleImageError = (e) => {
        e.target.src = "https://via.placeholder.com/300x200"; // Placeholder image
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="flex flex-wrap justify-center mt-12">
            {/* Add New User Card */}
            <div className="w-72 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-500 font-bold text-lg m-2">
                <Link to="/add" className="text-center">
                    + Add New User
                </Link>
            </div>

            {users.length > 0 ? (
                users.map((user) => (
                    <div className="w-72 border border-gray-300 rounded-lg shadow-md m-2 overflow-hidden transition-transform transform hover:scale-105" key={user.id}>
                        {/* User Image */}
                        <img 
                            src={`data:image/jpeg;base64,${user.image}`} 
                            alt={`${user.name}'s image`} 
                            className="w-full h-48 object-cover" 
                            onError={handleImageError} // Handle image loading errors
                        />

                        {/* User Info */}
                        <div className="p-4 text-center">
                            <h3 className="text-xl font-semibold">{user.name}</h3>
                            <p className="text-gray-600">{user.email}</p>
                            <p className="text-gray-600">Prediction Accuracy: {user.accuracy * 100}%</p> {/* Display accuracy */}

                            {/* Buttons */}
                            <div className="flex justify-center mt-2">
                                <Link to={`edit/${user.id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2">Edit</Link>
                                <button 
                                    onClick={() => handleDelete(user.id)} 
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No users found</p>
            )}
        </div>
    );
};

export default UserList;