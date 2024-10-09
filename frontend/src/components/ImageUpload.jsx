import React, { useState } from "react";
import axios from "axios";

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [probability, setProbability] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const predictionValue = response.data.probability;
      const percentage = (predictionValue * 100).toFixed(2); // Convert to percentage
      setProbability(percentage);
    } catch (error) {
      console.error("Error uploading the image", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Pneumonia Detection</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Upload and Predict"}
        </button>
      </form>

      {probability !== null && (
        <div>
          <h2>Prediction Result:</h2>
          <p>{probability}% chance of having pneumonia.</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
