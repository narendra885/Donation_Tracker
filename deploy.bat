@echo off
echo 🚀 Donation Tracker - GitHub Deployment Script
echo ==============================================

REM Check if git is initialized
if not exist ".git" (
    echo ❌ Git repository not found. Please run this script from the project root.
    pause
    exit /b 1
)

REM Get GitHub username
set /p GITHUB_USERNAME="📝 Enter your GitHub username: "

if "%GITHUB_USERNAME%"=="" (
    echo ❌ GitHub username is required.
    pause
    exit /b 1
)

REM Repository details for narendra885/Donation_Tracker
set GITHUB_USERNAME=narendra885
set REPO_NAME=Donation_Tracker

echo.
echo 📋 Repository Details:
echo    Username: %GITHUB_USERNAME%
echo    Repository: %REPO_NAME%
echo    URL: https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
echo    Live URL: https://%GITHUB_USERNAME%.github.io/%REPO_NAME%

echo.
set /p CONFIRM="🤔 Do you want to continue? (y/N): "

if /i not "%CONFIRM%"=="y" (
    echo ❌ Deployment cancelled.
    pause
    exit /b 1
)

echo.
echo 🔧 Setting up remote repository...

REM Remove existing remote if exists
git remote remove origin 2>nul

REM Add new remote
git remote add origin "https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git"

echo.
echo 📤 Pushing to GitHub...

REM Push to GitHub
git branch -M main
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ Successfully deployed to GitHub!
    echo.
    echo 🎯 Next Steps:
    echo 1. Go to: https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
    echo 2. Go to Settings ^> Pages
    echo 3. Set Source to 'GitHub Actions'
    echo 4. Wait for deployment (2-5 minutes^)
    echo 5. Visit: https://%GITHUB_USERNAME%.github.io/%REPO_NAME%
    echo.
    echo 📱 Demo Login Numbers:
    echo    Admin: 8392680202
    echo    Editor: 9876543210
    echo    Reader: 1234567890
) else (
    echo.
    echo ❌ Push failed. Please check:
    echo 1. Repository exists on GitHub: https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
    echo 2. You have push permissions
    echo 3. You're logged in to GitHub
    echo.
    echo 💡 Manual steps:
    echo 1. Create repository on GitHub: https://github.com/new
    echo 2. Repository name: %REPO_NAME%
    echo 3. Run: git push -u origin main
)

echo.
pause
