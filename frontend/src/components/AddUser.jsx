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
        navigate("/"); // Navigate to user list after successful addition
    } catch (error) {
        console.error("Error adding user:", error);
        setError("Failed to add user. Please try again."); // Update error state
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="flex flex-col items-center justify-center mt-20 p-6 border border-gray-300 rounded-lg shadow-md bg-gray-50 w-full max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Patient Registration Form</h1>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">Full Name:</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={handleNameChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">Email Address:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">Upload Medical Image:</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <button type="submit" disabled={loading} className="w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200">
          {loading ? "Submitting..." : "Add User"}
        </button>
      </form>
      {prediction && <p className="mt-4 text-gray-800">Prediction: {prediction}% chance of pneumonia.</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>} {/* Display error messages */}
    </div>
  );
};

export default AddUser;