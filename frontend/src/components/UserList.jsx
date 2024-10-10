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
    
    

    // CSS STYLING FOR CARDS
    const containerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: '50px',
    };

    const cardStyle = {
        width: '300px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        margin: '10px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        overflow: 'hidden',
        transition: 'transform 0.3s, box-shadow 0.3s',
    };

    const imageStyle = {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
    };

    const cardContentStyle = {
        padding: '15px',
    };

    const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '10px',
    };

    const buttonStyle = {
        padding: '5px 10px',
        margin: '0 5px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        color: '#fff',
    };

    const editButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#5bc0de',
    };

    const deleteButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#d9534f',
    };

    const addNewCardStyle = {
        ...cardStyle,
        border: '2px dashed #999',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#999',
        fontSize: '18px',
        fontWeight: 'bold',
    };

    // Error Handling for Image
    const handleImageError = (e) => {
        e.target.src = "https://via.placeholder.com/300x200"; // Placeholder image
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={containerStyle}>
            {/* Add New User Card */}
            <div style={addNewCardStyle}>
                <Link to="/add" style={{ textDecoration: 'none', color: '#999' }}>
                    + Add New User
                </Link>
            </div>

            {users.length > 0 ? (
                users.map((user) => (
                    <div style={cardStyle} key={user.id}>
                        {/* User Image */}
                        <img 
                            src={`data:image/jpeg;base64,${user.image}`} 
                            alt={`${user.name}'s image`} 
                            style={imageStyle} 
                            onError={handleImageError} // Handle image loading errors
                        />

                        {/* User Info */}
                        <div style={cardContentStyle}>
                            <h3>{user.name}</h3>
                            <p>{user.email}</p>
                            <p>Prediction Accuracy: {user.accuracy * 100}%</p> {/* Display accuracy */}

                            {/* Buttons */}
                            <div style={buttonContainerStyle}>
                                <Link to={`edit/${user.id}`} style={editButtonStyle}>Edit</Link>
                                <button 
                                    onClick={() => handleDelete(user.id)}  // Change deleteUser to handleDelete
                                    style={deleteButtonStyle}>
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
