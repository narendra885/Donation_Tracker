@echo off
echo 🚀 Donation Tracker - Google Sheets Integration Setup
echo =====================================================

echo.
echo 📝 Step 1: Get Your Google Apps Script URL
echo After deploying your Google Apps Script, you'll get a URL like:
echo https://script.google.com/macros/s/ABC123XYZ.../exec
echo.

set /p SCRIPT_URL="📋 Paste your Google Apps Script URL here: "

if "%SCRIPT_URL%"=="" (
    echo ❌ No URL provided. Exiting...
    pause
    exit /b 1
)

echo.
echo 🔧 Updating configuration...

REM Update the config.js file
powershell -Command "(Get-Content js\config.js) -replace 'REPLACE_WITH_YOUR_GOOGLE_APPS_SCRIPT_URL', '%SCRIPT_URL%' | Set-Content js\config.js"

echo ✅ Configuration updated!
echo.
echo 📤 Pushing changes to GitHub...

git add .
git commit -m "Connect to Google Sheets - Enable data persistence"
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ Successfully updated and deployed!
    echo.
    echo 🎯 Your live site: https://narendra885.github.io/Donation_Tracker
    echo 📊 Your Google Sheets: https://docs.google.com/spreadsheets/d/1-mYbsZ3CdevtXT1A3_mndUpUZoJ50h8riwDuRlaWcMA/edit
    echo.
    echo 📱 Login with these numbers:
    echo    Admin: 8392680202
    echo    Editor: 9876543210
    echo    Reader: 1234567890
    echo.
    echo 🔄 Wait 2-3 minutes for GitHub Pages to update, then test your site!
) else (
    echo ❌ Failed to push to GitHub. Please check your git setup.
)

echo.
pause
