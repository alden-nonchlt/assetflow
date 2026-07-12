@echo off
cd /d "%~dp0"
echo Killing any running node processes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo Running seed...
node seed.js
echo Seed complete!
echo Starting server...
start "AssetFlow Backend" cmd /c "node server.js"
timeout /t 3 /nobreak >nul
echo Server started on port 5000