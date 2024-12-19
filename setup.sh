echo "Setting up the backend..."
cd backend
chmod +x run_backend.sh
./run_backend.sh &

echo "Setting up the frontend..."
cd ../frontend
chmod +x run_frontend.sh
./run_frontend.sh &
