@echo off
echo 🔧 Update Google Apps Script URL
echo ================================

echo.
echo Current config shows: PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE
echo.
echo Your Google Apps Script URL should look like:
echo https://script.google.com/macros/s/AKfycbyXXXXXXXXXXXXXXX/exec
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
powershell -Command "(Get-Content js\config.js) -replace 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE', '%SCRIPT_URL%' | Set-Content js\config.js"

echo ✅ Configuration updated!
echo.
echo 📤 Pushing changes to GitHub...

git add js/config.js
git commit -m "Connect to Google Sheets - Add Google Apps Script URL"
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
    echo ✅ Data will now save permanently to Google Sheets!
) else (
    echo ❌ Failed to push to GitHub. Please check your git setup.
)

echo.
pause
