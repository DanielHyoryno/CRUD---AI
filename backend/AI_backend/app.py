from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Load the pre-trained .h5 model
model = tf.keras.models.load_model('pneumoniaClassifier2.h5')

@app.route('/')
def home():
    return "Welcome to the Pneumonia Detection API"

@app.route('/predict', methods=['POST'])
def predict():
    # Get the image from the request
    file = request.files['image']
    
    img = Image.open(file).convert('RGB')
    img = img.resize((256, 256))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Make a prediction
    prediction = model.predict(img_array)

    # Extract the prediction result (0 or 1)
    result = float(prediction[0][0])

    return jsonify({"probability": result})

if __name__ == '__main__':
    app.run(debug=True)
