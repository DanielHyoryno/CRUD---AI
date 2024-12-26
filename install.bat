@echo off
:: Enable echo for debugging purposes (can be turned off for production)
@echo on

:: Define MySQL executable path (update this path if MySQL is installed elsewhere)
set MYSQL_PATH=C:\xampp\mysql\bin\mysql.exe

:: Check if MySQL is running
echo Checking MySQL status...
"%MYSQL_PATH%" --version
if %ERRORLEVEL% neq 0 (
    echo ERROR: MySQL is not running or not accessible. Please start MySQL from the XAMPP Control Panel.
    pause
    exit /b
)

:: Check if the database exists, if not create it
echo Checking for the 'flask' database...
"%MYSQL_PATH%" -u root -e "SHOW DATABASES LIKE 'flask';"
if %ERRORLEVEL% neq 0 (
    echo Database not found. Creating database...
    "%MYSQL_PATH%" -u root -e "CREATE DATABASE flask;"
    if %ERRORLEVEL% neq 0 (
        echo ERROR: Failed to create the database. Please check your MySQL configuration and permissions.
        pause
        exit /b
    )
    echo Database 'flask' created successfully.
) else (
    echo Database 'flask' already exists.
)

:: Backend setup
echo Setting up the backend...
cd backend\AI_backend
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to navigate to backend directory. Please verify the folder structure.
    pause
    exit /b
)

:: Install Python dependencies
echo Installing Python dependencies...
python -m ensurepip --upgrade
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to upgrade pip. Ensure Python is installed and configured properly.
    pause
    exit /b
)
pip install --upgrade pip
pip install --user -r requirements.txt
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to install Python dependencies. Check the requirements.txt file and your Python environment.
    pause
    exit /b
)

:: Frontend setup
echo Setting up the frontend...
cd ..\..\frontend
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to navigate to frontend directory. Please verify the folder structure.
    pause
    exit /b
)
echo Installing frontend dependencies...
npm install
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to install frontend dependencies. Ensure Node.js and npm are installed.
    pause
    exit /b
)

:: Installation complete
echo Installation completed successfully.
pause
exit /b