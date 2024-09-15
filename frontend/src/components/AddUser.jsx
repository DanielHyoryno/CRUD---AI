import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('Male');
    const [image, setImage] = useState(null); // For the image file
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const saveUser = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('gender', gender);
        if (image) {
            formData.append('image', image);
        }

        try {
            await axios.post('http://localhost:5000/users', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate("/");
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    // CSS STYLING
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
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
    };

    const fieldStyle = {
        marginBottom: '15px',
    };

    const buttonStyle = {
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: '#28a745', // Green color
        color: '#fff',
        fontSize: '16px',
    };

    return (
        <div style={containerStyle}>
            <div style={formContainerStyle}>
                <form onSubmit={saveUser}>
                    <div style={fieldStyle}>
                        <label>Name</label>
                        <input 
                            type="text" 
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
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
                        <label>Image</label>
                        <input 
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={fieldStyle}>
                        <button type="submit" style={buttonStyle}>Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
