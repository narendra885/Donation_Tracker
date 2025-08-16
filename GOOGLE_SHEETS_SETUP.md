# 🔧 Connect Your Donation Tracker to Google Sheets

## Current Status
✅ Your site is live at: https://narendra885.github.io/Donation_Tracker
❌ Data disappears after refresh (Demo mode enabled)
❌ Not connected to Google Sheets yet

## Quick Setup (5 minutes)

### Step 1: Deploy Google Apps Script
1. Go to https://script.google.com
2. Click "New Project"
3. Delete all default code
4. Copy the entire code from `google-apps-script/Code.gs`
5. Paste it into the Google Apps Script editor
6. Click Deploy → New Deployment
7. Choose "Web app"
8. Set Execute as: "Me"
9. Set Who has access: "Anyone"
10. Click Deploy
11. **Copy the Web App URL** (looks like: https://script.google.com/macros/s/ABC123.../exec)

### Step 2: Update Configuration
Run the setup script:
```
connect-google-sheets.bat
```
Or manually update `js/config.js`:
- Replace `REPLACE_WITH_YOUR_GOOGLE_APPS_SCRIPT_URL` with your actual URL
- Verify `DEMO_MODE: false`

### Step 3: Deploy Changes
```
git add .
git commit -m "Connect to Google Sheets"
git push origin main
```

## After Setup
✅ Data will save permanently to Google Sheets
✅ Data persists after browser refresh
✅ Multiple users can access the same data
✅ You can view/edit data directly in Google Sheets

## Your Google Sheets
📊 View your data: https://docs.google.com/spreadsheets/d/1-mYbsZ3CdevtXT1A3_mndUpUZoJ50h8riwDuRlaWcMA/edit

## Test Login Numbers
- Admin: 8392680202
- Editor: 9876543210  
- Reader: 1234567890

## Need Help?
If you get any errors during the Google Apps Script deployment, make sure:
1. You copied the entire code correctly
2. You set permissions to "Anyone" 
3. You chose "Execute as: Me"
4. You copied the correct Web App URL (not the script URL)

The URL should end with `/exec`, not `/edit`.
