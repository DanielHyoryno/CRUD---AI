import mysql.connector
from mysql.connector import Error

# Function to create the database if it doesn't exist
def create_database_if_not_exists():
    try:
        # Connect to MySQL server
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password=""  # Adjust password if needed
        )

        if connection.is_connected():
            cursor = connection.cursor()
            cursor.execute("SHOW DATABASES")
            databases = cursor.fetchall()

            # Check if 'flask' database exists
            if not any(db[0] == 'flask' for db in databases):
                print("Database 'flask' not found. Creating database...")
                cursor.execute("CREATE DATABASE flask")
                print("Database 'flask' created successfully.")
            else:
                print("Database 'flask' already exists.")
            
            cursor.close()

    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
    finally:
        if connection.is_connected():
            connection.close()

# Call the function to ensure the database is created
create_database_if_not_exists()

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
from flask import jsonify
from sqlalchemy import func
import datetime
from dateutil.relativedelta import relativedelta

# Inisialisasi Flask dan konfigurasi
app = Flask(__name__)
CORS(app)  # Biar bisa akses dari semua origin (frontend dll)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/flask'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inisialisasi database dan serializer
db = SQLAlchemy(app)
ma = Marshmallow(app)

# Model tabel User
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    date = db.Column(db.DateTime, default=datetime.datetime.now)
    image = db.Column(db.LargeBinary)  # Simpan gambar dalam format binary (BLOB)
    accuracy = db.Column(Numeric(4, 2))  # Akurasi dengan 2 angka desimal

    def __init__(self, name, email, image, accuracy):
        self.name = name
        self.email = email
        self.image = image
        self.accuracy = accuracy

# Schema buat serialisasi data User
class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'email', 'date', 'accuracy')

# Inisialisasi schema
user_schema = UserSchema()
users_schema = UserSchema(many=True)

# Load model TensorFlow (.h5)
model = tf.keras.models.load_model('pneumoniaClassifier2.h5')

# Route buat ambil semua data User
@app.route('/get', methods=['GET'])
def get_users():
    all_users = User.query.all()
    results = []
    
    # Serialize data User satu per satu
    for user in all_users:
        user_data = user_schema.dump(user)
        
        # Kalau ada gambar, encode ke base64
        if user.image:
            try:
                user_data['image'] = base64.b64encode(user.image).decode('utf-8')
            except Exception:
                user_data['image'] = None  # Kalau ada error, set gambar jadi None
        else:
            user_data['image'] = None
        
        results.append(user_data)
        
    return jsonify(results)

# Route buat ambil satu User berdasarkan ID
@app.route('/get/<id>/', methods=['GET'])
def post_details(id):
    user = User.query.get(id)
    if user:
        return user_schema.jsonify(user)
    else:
        return jsonify({"message": "User tidak ditemukan"}), 404

# Route buat nambah User dan prediksi pneumonia
@app.route('/add', methods=['POST'])
def add_predict():
    name = request.form.get('name')
    email = request.form.get('email')
    
    # Cek apakah file ada atau nggak
    if 'image' not in request.files:
        return jsonify({"message": "File tidak ditemukan"}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({"message": "File tidak dipilih"}), 400

    # Proses gambar dan tambah User
    img = Image.open(file).convert('RGB')
    img = img.resize((256, 256))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Prediksi pakai model pre-trained
    prediction = model.predict(img_array)
    result = float(prediction[0][0])

    # Konversi gambar ke format binary buat disimpan
    img_binary = io.BytesIO()
    img.save(img_binary, format='JPEG')
    img_binary = img_binary.getvalue()

    # Buat instance User baru
    user = User(name=name, email=email, image=img_binary, accuracy=result)
    db.session.add(user)
    db.session.commit()

    return user_schema.jsonify(user)

# Route buat update data User
@app.route('/update/<id>/', methods=['PUT'])
def update_user(id):
    user = User.query.get(id)
    if user:  # Cek apakah User ada
        name = request.form.get('name', user.name)
        email = request.form.get('email', user.email)
        # Kalau ada gambar baru, proses ulang gambar
        if 'image' in request.files and request.files['image'].filename != '':
            file = request.files['image']
            img = Image.open(file).convert('RGB')
            img = img.resize((256, 256))
            img_array = np.array(img) / 255.0
            img_array = np.expand_dims(img_array, axis=0)
            # Prediksi ulang
            prediction = model.predict(img_array)
            result = float(prediction[0][0])
            # Konversi gambar ke binary
            img_binary = io.BytesIO()
            img.save(img_binary, format='JPEG')
            img_binary = img_binary.getvalue()
            user.image = img_binary
            user.accuracy = result
        user.name = name
        user.email = email
        db.session.commit()
        return user_schema.jsonify(user)
    else:
        return jsonify({"message": "User tidak ditemukan"}), 404

# Route buat hapus User
@app.route('/delete/<id>/', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return user_schema.jsonify(user)
    else:
        return jsonify({"message": "User tidak ditemukan"}), 404

# Route buat statistik pasien per bulan di tahun 2024
@app.route('/api/patient-stats', methods=['GET'])
def patient_stats():
    try:
        # Hitung jumlah User dengan akurasi di atas atau di bawah 0.5
        above_50_count = User.query.filter(User.accuracy > 0.5).count()
        below_50_count = User.query.filter(User.accuracy <= 0.5).count()

        print(f"Akurasi di atas 50%: {above_50_count}")
        print(f"Akurasi di bawah 50%: {below_50_count}")

        # Hitung jumlah pasien per bulan di tahun 2024
        monthly_counts = []
        year = 2024

        for month in range(1, 13):
            # Hitung awal dan akhir bulan
            month_start = datetime.datetime(year, month, 1)
            month_end = (month_start + relativedelta(months=1)).replace(day=1)

            count = User.query.filter(
                func.date(User.date) >= month_start.date(),
                func.date(User.date) < month_end.date()
            ).count()
            
            monthly_counts.append(count)
            print(f"Bulan {month}: {count} pasien dari {month_start.date()} sampai {month_end.date()}")

        # Buat response JSON
        stats = {
            "above50": above_50_count,
            "below50": below_50_count,
            "monthlyCounts": monthly_counts
        }

        return jsonify(stats)

    except Exception as e:
        print(f"Error di patient_stats: {e}")
        return jsonify({"error": "Gagal mendapatkan statistik pasien", "details": str(e)}), 500

# Jalankan aplikasi Flask
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Buat semua tabel di database
    app.run(debug=True)
