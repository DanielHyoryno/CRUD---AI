@echo off
:: Enable echo for debugging purposes (can be turned off for production)
@echo on

:: Run the backend
echo Starting the backend...
cd backend\AI_backend
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to navigate to backend directory. Please verify the folder structure.
    pause
    exit /b
)
start "" python app.py
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to start the backend. Ensure app.py is configured correctly.
    pause
    exit /b
)

:: Run the frontend
echo Starting the frontend development server...
cd ..\..\frontend
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to navigate to frontend directory. Please verify the folder structure.
    pause
    exit /b
)
start "" cmd /k "npm run dev"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to start the frontend development server. Check the npm configuration.
    pause
    exit /b
)

:: Exit
echo Servers started successfully.
pause
exit /b
