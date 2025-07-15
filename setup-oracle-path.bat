@echo off
echo Setting up Oracle Instant Client PATH...

:: Check if Oracle Instant Client directory exists
set ORACLE_PATH=D:\software\instantclient-basic-windows.x64-23.7.0.25.01\instantclient_23_7
if not exist "%ORACLE_PATH%" (
    echo ERROR: Oracle Instant Client directory not found: %ORACLE_PATH%
    echo Please verify the installation path.
    pause
    exit /b 1
)

:: Add to PATH for current session
set PATH=%PATH%;%ORACLE_PATH%
echo Oracle Instant Client added to PATH for current session.

:: Add to PATH permanently (requires admin privileges)
echo Adding to system PATH permanently...
setx PATH "%PATH%;%ORACLE_PATH%" /M
if %errorlevel% neq 0 (
    echo WARNING: Could not add to system PATH. You may need to run as Administrator.
    echo Adding to user PATH instead...
    setx PATH "%PATH%;%ORACLE_PATH%"
)

echo.
echo Setup completed! Please restart your terminal/IDE to use the new PATH.
echo.
echo To verify installation, run: tnsping
echo.
pause
