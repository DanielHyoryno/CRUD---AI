import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('Male');
    const [image, setImage] = useState(null); // This holds the file to upload
    const [imagePreview, setImagePreview] = useState(''); // For current image preview
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        getUserById();
    }, [id]);

    const getUserById = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/users/${id}`);
            setName(response.data.name);
            setEmail(response.data.email);
            setGender(response.data.gender);
            // Only set imagePreview if image path exists
            if (response.data.image) {
                setImagePreview(`http://localhost:5000${response.data.image}`);
            } else {
                setImagePreview('');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user:', error);
            setError('Failed to load user data.');
            setLoading(false);
        }
    };

    const updateUser = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('gender', gender);
            if (image) {
                formData.append('image', image);
            }

            await axios.patch(`http://localhost:5000/users/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate("/");
        } catch (error) {
            console.error('Error updating user:', error);
            setError('Failed to update user.');
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setImagePreview(URL.createObjectURL(e.target.files[0])); // For preview
        }
    };

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
                        {/* Display current image */}
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
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Name"
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                required
                            />
                        </div>

                        <div style={fieldStyle}>
                            <label>Email</label>
                            <input 
                                type="email" 
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                required
                            />
                        </div>

                        <div style={fieldStyle}>
                            <label>Gender</label>
                            <select
                                name="gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div style={fieldStyle}>
                            <label>New Image</label>
                            <input 
                                type="file" 
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
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
