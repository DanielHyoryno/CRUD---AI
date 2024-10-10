from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from decimal import Decimal
from sqlalchemy import Numeric
import tensorflow as tf
import numpy as np
import datetime
from PIL import Image
import io
import base64
from marshmallow import post_dump

# Initialize the Flask app and its configurations
app = Flask(__name__)
CORS(app)  # Allow all origins; adjust as needed


app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/flask'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database and serialization libraries
db = SQLAlchemy(app)
ma = Marshmallow(app)

# Declare the User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    date = db.Column(db.DateTime, default=datetime.datetime.now)
    image = db.Column(db.LargeBinary)  # To store image binary data (BLOB)
    accuracy = db.Column(Numeric(4, 2))  # Accuracy with 2 decimal places

    def __init__(self, name, email, image, accuracy):
        self.name = name
        self.email = email
        self.image = image
        self.accuracy = accuracy

# Schema to serialize User model data
# Schema to serialize User model data

class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'email', 'date', 'accuracy')
# Initialize schemas
user_schema = UserSchema()
users_schema = UserSchema(many=True)

# Load the pre-trained .h5 model
model = tf.keras.models.load_model('pneumoniaClassifier2.h5')



# Initialize schemas
user_schema = UserSchema()
users_schema = UserSchema(many=True)

# Route to get all users
@app.route('/get', methods=['GET'])
def get_users():
    all_users = User.query.all()
    results = []
    
    # Manually serialize each user object
    for user in all_users:
        user_data = user_schema.dump(user)
        
        # Encode the image to base64 if it exists
        if user.image:
            try:
                user_data['image'] = base64.b64encode(user.image).decode('utf-8')
            except Exception:
                user_data['image'] = None  # In case of an error, set the image as None
        else:
            user_data['image'] = None
        
        results.append(user_data)
        
    return jsonify(results)


# Route to get a single user by ID
@app.route('/get/<id>/', methods=['GET'])
def post_details(id):
    user = User.query.get(id)
    if user:
        return user_schema.jsonify(user)
    else:
        return jsonify({"message": "User not found"}), 404

# Route to add a user and run pneumonia prediction
@app.route('/add', methods=['POST'])
def add_predict():
    name = request.form.get('name')
    email = request.form.get('email')
    
    # Check if the file is present
    if 'image' not in request.files:
        return jsonify({"message": "No file part"}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400

    # Process the image and add the user
    img = Image.open(file).convert('RGB')
    img = img.resize((256, 256))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Make a prediction using the pre-trained model
    prediction = model.predict(img_array)
    result = float(prediction[0][0])

    # Convert the image to binary format for storage
    img_binary = io.BytesIO()
    img.save(img_binary, format='JPEG')
    img_binary = img_binary.getvalue()

    # Create a new User instance with the image and prediction accuracy
    user = User(name=name, email=email, image=img_binary, accuracy=result)
    db.session.add(user)
    db.session.commit()

    return user_schema.jsonify(user)

# Route to update an existing user
@app.route('/update/<id>/', methods=['PUT'])
def update_user(id):
    user = User.query.get(id)
    if user:  # Check if the user exists
        name = request.form.get('name', user.name)  # Use form data for text fields
        email = request.form.get('email', user.email)
        # Check if an image is provided in the request
        if 'image' in request.files and request.files['image'].filename != '':
            file = request.files['image']
            img = Image.open(file).convert('RGB')
            img = img.resize((256, 256))
            img_array = np.array(img) / 255.0
            img_array = np.expand_dims(img_array, axis=0)
            # Make a prediction
            prediction = model.predict(img_array)
            result = float(prediction[0][0])
            # Convert the image to binary format for storage
            img_binary = io.BytesIO()
            img.save(img_binary, format='JPEG')
            img_binary = img_binary.getvalue()
            # Update the user's image and accuracy
            user.image = img_binary
            user.accuracy = result
        # Update the user's name and email
        user.name = name
        user.email = email
        db.session.commit()
        return user_schema.jsonify(user)
    else:
        return jsonify({"message": "User not found"}), 404


# Route to delete a user
@app.route('/delete/<id>/', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)
    if user:
        db.session.delete(user)
        db.session.commit()  # Ensure this line is executed
        return user_schema.jsonify(user)
    else:
        return jsonify({"message": "User not found"}), 404

# Run the Flask app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # This will create all the tables in the database.
    app.run(debug=True)

