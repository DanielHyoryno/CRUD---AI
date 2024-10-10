import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null); // State to handle error messages

  const navigate = useNavigate(); // Initialize useNavigate

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Log the form data
    console.log("Form Data:", { name, email, file });

    // Check if all required fields are filled
    if (!name || !email || !file) {
        alert("All fields are required.");
        return;
    }

    // Construct FormData as before
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("image", file);

    setLoading(true);
    setError(null); // Reset any previous errors

    try {
        const response = await axios.post("http://localhost:5000/add", formData);
        console.log("Response:", response.data); // Log the response
        setPrediction((response.data.accuracy * 100).toFixed(2));
        alert("User added successfully!"); // Show success message
        navigate("/users/"); // Navigate to user list after successful addition
    } catch (error) {
        console.error("Error adding user:", error);
        setError("Failed to add user. Please try again."); // Update error state
    } finally {
        setLoading(false);
    }
};

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Patient Registration Form</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Full Name:</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={handleNameChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Email Address:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Upload Medical Image:</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            style={styles.fileInput}
            required
          />
        </div>
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Submitting..." : "Add User"}
        </button>
      </form>
      {prediction && <p style={styles.prediction}>Prediction: {prediction}% chance of pneumonia.</p>}
      {error && <p style={styles.error}>{error}</p>} {/* Display error messages */}
    </div>
  );
};

// Styles for the form
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
    width: '90%',
    maxWidth: '500px',
  },
  title: {
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    width: '100%',
  },
  field: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  fileInput: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  button: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#28a745',
    color: '#fff',
    fontSize: '16px',
    width: '100%',
  },
  prediction: {
    marginTop: '15px',
    fontSize: '16px',
    color: '#333',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};

export default AddUser;