import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        accuracy: null,
        image: null
    });
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        getUserById();
    }, [id]);

    // Fetch user details by ID
    const getUserById = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/get/${id}`);
            const userData = response.data;
            setUser({
                name: userData.name,
                email: userData.email,
                accuracy: userData.accuracy,
                image: null
            });
            if (userData.image) {
                setImagePreview(`data:image/jpeg;base64,${userData.image}`);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user:', error);
            setError('Failed to load user data.');
            setLoading(false);
        }
    };

    // Update user details
    const updateUser = async (e) => {
        e.preventDefault();
        console.log("Updating user:", user); // Log the user data being submitted

        try {
            const formData = new FormData();
            formData.append('name', user.name);
            formData.append('email', user.email);
            if (user.image) {
                formData.append('image', user.image);
            }

            // Send the PUT request to update the user
            const response = await axios.put(`http://localhost:5000/update/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // If a new image is uploaded, make a prediction
            if (user.image) {
                const img = new Image();
                img.src = URL.createObjectURL(user.image);
                img.onload = async () => {
                    const imgArray = preprocessImage(img); // Function to preprocess the image
                    const predictionResponse = await axios.post(`http://localhost:5000/predict`, imgArray);
                    const predictionAccuracy = predictionResponse.data.accuracy; // Assuming your backend returns accuracy
                    console.log("Prediction accuracy:", predictionAccuracy);
                    setUser((prevUser) => ({
                        ...prevUser,
                        accuracy: predictionAccuracy
                    }));
                };
            }

            console.log("Update response:", response.data); // Log the response
            navigate("/"); // Navigate to user list after update
        } catch (error) {
            console.error('Error updating user:', error);
            setError('Failed to update user.');
        }
    };

    // Function to preprocess the image for prediction
    const preprocessImage = (img) => {
        // Convert the image to a format suitable for your model
        // This is a placeholder; implement your preprocessing logic here
        // For example, resizing, normalizing, etc.
        return img; // Return the processed image
    };

    // Handle form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
    };

    // Handle image selection
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setUser((prevUser) => ({
                ...prevUser,
                image: file
            }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Styles
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
    };

    const formContainerStyle = {
        width: '80%',
        maxWidth: '600px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    };

    const fieldStyle = {
        marginBottom: '15px',
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
    };

    const buttonStyle = {
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: '#28a745',
        color: '#fff',
        fontSize: '16px',
    };

    const imageStyle = {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        marginBottom: '15px',
    };

    return (
        <div style={containerStyle}>
            <div style={formContainerStyle}>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <form onSubmit={updateUser}>
                        {/* Display current image if available */}
                        {imagePreview && (
                            <div style={fieldStyle}>
                                <label>Current Image</label>
                                <img 
                                    src={imagePreview} 
                                    alt="User's current image" 
                                    style={imageStyle} 
                                />
                            </div>
                        )}

                        <div style={fieldStyle}>
                            <label>Name</label>
                            <input 
                                type="text" 
                                name="name"
                                value={user.name}
                                onChange={handleInputChange}
                                placeholder="Name"
                                style={inputStyle}
                                required
                            />
                        </div>

                        <div style={fieldStyle}>
                            <label>Email</label>
                            <input 
                                type="email" 
                                name="email"
                                value={user.email}
                                onChange={handleInputChange}
                                placeholder="Email"
                                style={inputStyle}
                                required
                            />
                        </div>

                        <div style={fieldStyle}>
                            <label>Prediction Accuracy</label>
                            <input 
                                type="text" 
                                name="accuracy"
                                value={user.accuracy !== null ? `${(user.accuracy * 100).toFixed(2)}%` : 'N/A'}
                                readOnly
                                style={inputStyle}
                            />
                        </div>

                        <div style={fieldStyle}>
                            <label>New Image</label>
                            <input 
                                type="file" 
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={inputStyle}
                            />
                        </div>

                        <div style={fieldStyle}>
                            <button type="submit" style={buttonStyle}>Save</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EditUser;