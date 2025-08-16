# 🎯 Quick Setup Checklist

Your Google Sheets link is **CORRECT**: `https://docs.google.com/spreadsheets/d/1-mYbsZ3CdevtXT1A3_mndUpUZoJ50h8riwDuRlaWcMA/edit?usp=drivesdk`

## ✅ Extracted Information

- **Spreadsheet ID**: `1-mYbsZ3CdevtXT1A3_mndUpUZoJ50h8riwDuRlaWcMA`
- **Status**: ✅ Valid Google Sheets URL format
- **Apps Script**: ✅ Updated with your Spreadsheet ID

## 🚀 Next Steps

### 1. Google Apps Script Setup
1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Copy the ENTIRE content from `google-apps-script/Code.gs` (it's already updated with your Sheet ID)
4. Save the project with name: "Donation Tracker Backend"
5. Click "Run" button to test `setupInitial` function
6. Grant permissions when prompted
7. Deploy as Web App:
   - Click "Deploy" → "New deployment"
   - Type: "Web app"
   - Execute as: "Me" 
   - Who has access: "Anyone"
   - Click "Deploy"
   - **COPY THE WEB APP URL** (you'll need this!)

### 2. Update Frontend Configuration
1. Open `js/config.js`
2. Replace `YOUR_SCRIPT_ID` with your actual Script ID from the Web App URL
3. Set `DEMO_MODE: false` for production

### 3. Test the Integration
1. Open `index.html` in browser
2. Login with: `8392680202` (admin user)
3. Check your Google Sheet - it should now have:
   - Sheet named "Authorized_Users" 
   - Sheet named "Donations_2025" (current year)

## 🔧 Your Updated Config Should Look Like:

```javascript
const CONFIG = {
    // Replace YOUR_SCRIPT_ID with actual ID from Apps Script Web App URL
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
    
    // Set to false for production
    DEMO_MODE: false,
    
    // Other settings stay the same...
};
```

## 🐛 Troubleshooting

If you see "after refresh it going fix it":
- This usually means the Google Apps Script needs proper permissions
- Run the `setupInitial()` function in Apps Script first
- Make sure you grant all permissions when prompted
- The sheets will be created automatically on first run

## ✅ Success Indicators

You'll know it's working when:
- Login with `8392680202` succeeds
- You can add a donation and it appears in your Google Sheet
- The "Authorized_Users" sheet is created automatically
- The "Donations_2025" sheet is created automatically

---

**Your Spreadsheet ID is correctly configured! Follow the steps above to complete the setup.**
