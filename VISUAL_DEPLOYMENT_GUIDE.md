# 🚀 Visual Google Apps Script Deployment Guide

## Step-by-Step Instructions:

### 📝 Step 1: Create New Project
1. At [script.google.com](https://script.google.com), click **"New project"**
2. You'll see default code - **SELECT ALL and DELETE it**

### 📋 Step 2: Copy Your Code
1. From your `COPY_THIS_CODE.md` file, copy ALL 542 lines
2. Paste into the empty Apps Script editor
3. The code already has your Spreadsheet ID: `1-mYbsZ3CdevtXT1A3_mndUpUZoJ50h8riwDuRlaWcMA`

### 💾 Step 3: Save Project
1. Click **Save** (💾) or press Ctrl+S
2. Name it: **"Donation Tracker Backend"**
3. Click **Save**

### ▶️ Step 4: Run Initial Setup
1. In function dropdown, select **"setupInitial"**
2. Click **Run** button (▶️)
3. **IMPORTANT**: Grant permissions:
   - Click **"Review permissions"**
   - Choose your Google account
   - Click **"Advanced"**
   - Click **"Go to Donation Tracker Backend (unsafe)"**
   - Click **"Allow"**

### 🚀 Step 5: Deploy as Web App
1. Click **"Deploy"** → **"New deployment"**
2. Click gear icon (⚙️) next to "Type"
3. Select **"Web app"**
4. Configuration:
   ```
   Description: Donation Tracker API v1.0
   Execute as: Me (your-email@gmail.com)
   Who has access: Anyone
   ```
5. Click **"Deploy"**

### 📝 Step 6: Copy Web App URL
Your URL will look like:
```
https://script.google.com/macros/s/AKfycbx...LONG_ID.../exec
```

**COPY THIS URL** and paste it here!

---

## ✅ What Will Happen:

1. **Google Sheets will be set up** with:
   - `AuthorizedUsers` sheet with admin user `8392680202`
   - `Donations_2025` sheet ready for data

2. **Your Web App** will be live and ready to connect to frontend

3. **I'll update your config** automatically when you share the URL

---

## 🔧 Quick Test:
After deployment, open your Web App URL in a new tab. 
You should see: `{"success":false,"message":"Invalid action"}`
This means it's working! ✅

**Ready? Copy the 542-line code from your file and deploy it!**
