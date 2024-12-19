@echo off
echo Installing backend dependencies...
pip install -r requirements.txt

echo Running backend application...
python app.py
pause
