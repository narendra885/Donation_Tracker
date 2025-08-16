# Setup Instructions for Donation Tracker

## Quick Start Guide

### 1. 📋 Copy Google Apps Script Code
1. Open [Google Apps Script](https://script.google.com/)
2. Create a new project
3. Copy the entire content from `google-apps-script/Code.gs`
4. Paste it into the Apps Script editor
5. Save the project (name it "Donation Tracker Backend")

### 2. 📊 Create Google Sheet
1. Create a new [Google Sheet](https://sheets.google.com/)
2. Copy the Sheet ID from the URL (long string between `/d/` and `/edit`)
3. Go back to your Apps Script
4. Replace `YOUR_GOOGLE_SHEETS_ID_HERE` with your actual Sheet ID
5. Save the script

### 3. 🚀 Deploy Apps Script as Web App
1. In Apps Script, click "Deploy" → "New Deployment"
2. Choose "Web app" as the type
3. Set "Execute as" to "Me"
4. Set "Who has access" to "Anyone"
5. Click "Deploy"
6. **IMPORTANT**: Copy the Web App URL (save it for step 4)

### 4. 🔧 Configure Frontend
Replace the Web App URL in these 3 files:
- `js/auth.js` (line 2)
- `js/dashboard.js` (line 8) 
- `js/admin.js` (line 8)

Change `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` to your actual Web App URL.

### 5. 🎯 Initialize Database
1. Go back to your Google Apps Script
2. Click on the "setupInitial" function
3. Click "Run" to create the initial database structure
4. This creates the required sheets and adds the default admin user

### 6. 🌐 Deploy to GitHub Pages
1. Create a new GitHub repository
2. Upload all project files
3. Go to Settings → Pages
4. Select "main" branch and "/ (root)" folder
5. Save and wait for deployment

### 7. 🔐 First Login
1. Visit your GitHub Pages URL
2. Login with: `+1234567890` (default admin number)
3. Go to Admin panel to add more authorized numbers

## Default Configuration

- **Default Admin Number**: `+1234567890`
- **Session Duration**: 24 hours
- **Mobile Format**: `+[country code][number]` (e.g., `+1234567890`)

## Testing Locally

Run the "Open Live Server" task in VS Code or use:
```bash
python -m http.server 8000
```

Then visit: `http://localhost:8000`

## Need Help?

1. Check that your Google Apps Script Web App URL is correct
2. Verify the Google Sheet ID is properly set
3. Ensure you ran the `setupInitial()` function
4. Try the default admin number: `+1234567890`

The app includes demo data when the backend is not configured, so you can test the interface immediately!
