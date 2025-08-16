## 🎯 Google Apps Script Setup - Step by Step

### Step 1: Create New Apps Script Project
1. **Already opened**: Google Apps Script (script.google.com)
2. Click **"New project"** button
3. You'll see a default `function myFunction()` - **DELETE ALL the default code**

### Step 2: Copy the Complete Code
1. **IMPORTANT**: Select ALL text in the Code.gs editor and delete it
2. Copy the ENTIRE content from your `google-apps-script/Code.gs` file (542 lines)
3. Paste it into the Apps Script editor

**Your code is already configured with:**
- ✅ Spreadsheet ID: `1-mYbsZ3CdevtXT1A3_mndUpUZoJ50h8riwDuRlaWcMA`
- ✅ Admin user: `8392680202`
- ✅ Yearly organization system
- ✅ 3-tier role system

### Step 3: Save and Name Project
1. Click **💾 Save** button (Ctrl+S)
2. Name your project: **"Donation Tracker Backend"**
3. Click **Save**

### Step 4: Run Initial Setup
1. In the function dropdown, select **"setupInitial"**
2. Click **▶️ Run** button
3. **IMPORTANT**: You'll see authorization prompts:
   - Click **"Review permissions"**
   - Choose your Google account
   - Click **"Advanced"**
   - Click **"Go to Donation Tracker Backend (unsafe)"**
   - Click **"Allow"**

### Step 5: Verify Setup Worked
1. Check your Google Sheet: https://docs.google.com/spreadsheets/d/1-mYbsZ3CdevtXT1A3_mndUpUZoJ50h8riwDuRlaWcMA/edit
2. You should now see:
   - ✅ **"AuthorizedUsers"** sheet with admin user `8392680202`
   - ✅ **"Donations_2025"** sheet ready for data

### Step 6: Deploy as Web App
1. Click **"Deploy"** → **"New deployment"**
2. Click the ⚙️ gear icon next to "Type"
3. Select **"Web app"**
4. Configure deployment:
   - **Description**: "Donation Tracker API v1.0"
   - **Execute as**: "Me (your-email@gmail.com)"
   - **Who has access**: "Anyone"
5. Click **"Deploy"**
6. **COPY THE WEB APP URL** - it looks like:
   ```
   https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec
   ```

### Step 7: Test the Web App
1. Open the Web App URL in a new tab
2. You should see JSON response like:
   ```json
   {"success":false,"message":"No action specified"}
   ```
3. This means it's working! ✅

---

## 🔧 Next: Update Frontend Configuration

After you complete the Apps Script setup, I'll help you:
1. Update `js/config.js` with your Web App URL
2. Set up GitHub Pages deployment
3. Test the complete system

**Ready to proceed? Complete the Apps Script steps above, then let me know your Web App URL!**
