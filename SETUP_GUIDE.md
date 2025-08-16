# Google Sheets Integration Setup Guide

Follow these steps to connect your Donation Tracker to Google Sheets for data storage.

## Part 1: Google Sheets Setup

### Step 1: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "Donation Tracker Data"
4. Copy the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)
   - Example: `https://docs.google.com/spreadsheets/d/1ABC...XYZ/edit#gid=0`
   - The ID is: `1ABC...XYZ`

### Step 2: Note Your Spreadsheet ID
- Keep this ID handy - you'll need it for the Google Apps Script

## Part 2: Google Apps Script Setup

### Step 1: Create Apps Script Project
1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the code from `google-apps-script/Code.gs`

### Step 2: Configure the Script
1. At the top of the script, find this line:
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
   ```
2. Replace `YOUR_SPREADSHEET_ID_HERE` with your actual spreadsheet ID from Step 1

### Step 3: Set Permissions
1. Click the "Save" button (💾)
2. Give your project a name (e.g., "Donation Tracker Backend")
3. Click "Run" button to test the `setupInitial` function
4. Grant permissions when prompted:
   - Click "Review permissions"
   - Choose your Google account
   - Click "Advanced" → "Go to [Your Project Name] (unsafe)"
   - Click "Allow"

### Step 4: Deploy as Web App
1. Click "Deploy" → "New deployment"
2. Click the gear icon ⚙️ next to "Type"
3. Select "Web app"
4. Fill in the details:
   - **Description**: "Donation Tracker API"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
5. Click "Deploy"
6. Copy the "Web app URL" - you'll need this for the frontend

## Part 3: Frontend Configuration

### Step 1: Update Config
1. Open `js/config.js`
2. Update the configuration:
   ```javascript
   const CONFIG = {
       // Replace with your actual Google Apps Script Web App URL
       APPS_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
       
       // Set to false to use real Google Sheets
       DEMO_MODE: false,
       
       // Rest of the config...
   };
   ```

### Step 2: Replace Placeholder URL
- Replace `YOUR_SCRIPT_ID` with the actual script ID from your Web App URL
- The script ID is the long string in your Web App URL

## Part 4: Testing the Integration

### Step 1: Test Authentication
1. Open your website
2. Try logging in with mobile number: `8392680202`
3. You should be redirected to the dashboard

### Step 2: Test Data Operations
1. Try adding a new donation
2. Check your Google Sheet - you should see:
   - A new sheet named "Authorized_Users" with user data
   - A new sheet named "Donations_2024" (or current year) with donation data

### Step 3: Test Admin Functions
1. Go to Admin Panel (as admin user: 8392680202)
2. Try adding a new user
3. Test changing user roles
4. Verify the changes appear in the "Authorized_Users" sheet

## Part 5: Customization

### Adding Admin Users
1. Open your Google Sheet
2. Go to the "Authorized_Users" sheet
3. Add new rows with the format:
   - Column A: Unique ID (timestamp)
   - Column B: Mobile Number (10 digits)
   - Column C: User Name
   - Column D: Role (admin/read_edit/read_only)
   - Column E: Status (active/inactive)
   - Column F: Added Date (YYYY-MM-DD)

### Yearly Data Organization
- The system automatically creates new sheets for each year
- Format: "Donations_YYYY" (e.g., "Donations_2024", "Donations_2025")
- Data is organized by year for better management

## Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Check if your Google Apps Script is deployed as a web app
   - Verify the Web App URL in config.js is correct
   - Ensure "Anyone" has access to the web app

2. **"Data not saving"**
   - Check if the spreadsheet ID in Code.gs is correct
   - Verify the Apps Script has permission to edit the sheet
   - Check the browser console for error messages

3. **"Permission denied"**
   - Re-run the setupInitial function in Apps Script
   - Grant all requested permissions
   - Make sure you're signed in to the correct Google account

4. **"Mobile number not authorized"**
   - Check the "Authorized_Users" sheet in your Google Sheets
   - Verify the mobile number format (10 digits, no spaces or symbols)
   - Ensure the user status is "active"

### Debug Mode
- Set `DEBUG: true` in config.js to see detailed console logs
- Open browser developer tools (F12) to view console messages
- Check for any JavaScript errors in the console

## Security Notes

1. **Mobile Number Format**: Always use 10-digit format (no country codes, spaces, or symbols)
2. **Role Permissions**: 
   - `admin`: Full access (add/edit/delete users and donations)
   - `read_edit`: Can view and add donations, cannot manage users
   - `read_only`: Can only view donation data
3. **Session Management**: Sessions expire after 24 hours for security

## Backup and Export

The system includes CSV export functionality:
- Export by year or all data
- Automatic date formatting
- Includes all donation fields

For additional backup, you can also:
1. Go to Google Sheets
2. File → Download → Excel (.xlsx) or CSV

---

**Need Help?**
- Check the browser console for error messages
- Verify all URLs and IDs are correctly configured
- Test with demo mode first (DEMO_MODE: true) before switching to production
