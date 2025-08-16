# GitHub Pages Deployment Guide

This guide will help you deploy your Donation Tracker to GitHub Pages for free hosting.

## Prerequisites
- GitHub account
- Your donation tracker code ready
- Google Sheets integration configured (see SETUP_GUIDE.md)

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "New repository" or the "+" icon
3. Fill in repository details:
   - **Repository name**: `donation-tracker` (or your preferred name)
   - **Description**: "Free donation tracking web application with Google Sheets backend"
   - **Visibility**: Public (required for free GitHub Pages)
   - ✅ Check "Add a README file"
4. Click "Create repository"

## Step 2: Upload Your Code

### Option A: Using GitHub Web Interface
1. In your new repository, click "uploading an existing file"
2. Drag and drop all your project files OR click "choose your files"
3. Select all files from your project folder:
   - `index.html`
   - `dashboard.html`
   - `admin.html`
   - `css/` folder
   - `js/` folder
   - `google-apps-script/` folder (for reference)
   - `README.md`
   - `SETUP_GUIDE.md`
4. Write a commit message: "Initial commit - Donation Tracker v1.0"
5. Click "Commit changes"

### Option B: Using Git Commands
```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/donation-tracker.git
cd donation-tracker

# Copy your files to this directory
# (copy all project files here)

# Add and commit files
git add .
git commit -m "Initial commit - Donation Tracker v1.0"
git push origin main
```

## Step 3: Enable GitHub Pages

1. In your repository, click "Settings" tab
2. Scroll down to "Pages" in the left sidebar
3. Under "Source", select "Deploy from a branch"
4. Choose "main" branch
5. Choose "/ (root)" folder
6. Click "Save"

## Step 4: Access Your Website

1. After a few minutes, your site will be available at:
   ```
   https://YOUR_USERNAME.github.io/donation-tracker/
   ```
2. GitHub will show you the URL in the Pages settings
3. It may take 5-10 minutes for the site to become active

## Step 5: Configure for Production

### Update Configuration
1. Make sure your `js/config.js` has the correct settings:
   ```javascript
   const CONFIG = {
       // Your actual Google Apps Script URL
       APPS_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
       
       // Set to false for production
       DEMO_MODE: false,
       
       // Set to false for production
       DEBUG: false,
       
       // Other settings...
   };
   ```

### Test Your Live Site
1. Visit your GitHub Pages URL
2. Test login with your admin mobile number
3. Verify data is saving to Google Sheets
4. Test all functionality (add donations, user management, etc.)

## Step 6: Custom Domain (Optional)

If you have your own domain:

1. In repository Settings → Pages
2. Under "Custom domain", enter your domain (e.g., `donations.yourdomain.com`)
3. Create a CNAME record in your domain's DNS settings:
   - **Name**: `donations` (or your subdomain)
   - **Value**: `YOUR_USERNAME.github.io`
4. Wait for DNS propagation (can take up to 24 hours)

## Updating Your Site

### Method 1: GitHub Web Interface
1. Navigate to the file you want to edit
2. Click the pencil icon (✏️) to edit
3. Make your changes
4. Commit changes with a descriptive message
5. Changes will automatically deploy to your live site

### Method 2: Git Commands
```bash
# Make your changes locally
git add .
git commit -m "Description of your changes"
git push origin main
```

## Important Notes

### Security Considerations
- Never commit sensitive data like API keys or passwords
- The Google Apps Script Web App URL is safe to include (it's public anyway)
- Mobile numbers are hashed/encrypted during authentication

### Free Hosting Limits
- GitHub Pages is free for public repositories
- Bandwidth limit: 100GB per month
- Storage limit: 1GB per repository
- Perfect for small to medium donation tracking needs

### SSL Certificate
- GitHub Pages automatically provides HTTPS
- Your site will be secure by default
- No additional configuration needed

## Troubleshooting

### Site Not Loading
- Wait 10-15 minutes after enabling Pages
- Check that `index.html` is in the root directory
- Verify branch and folder settings in Pages configuration

### JavaScript Errors
- Open browser developer tools (F12)
- Check console for error messages
- Verify all file paths are correct (case-sensitive)

### Google Sheets Not Working
- Check that `DEMO_MODE: false` in config.js
- Verify your Google Apps Script Web App URL is correct
- Test the Google Apps Script independently

### 404 Errors on Navigation
- GitHub Pages serves static files only
- All navigation should work with the current setup
- Check file names and paths are correct

## Maintenance

### Regular Updates
- Monitor your site for any issues
- Update mobile numbers in Google Sheets as needed
- Backup your Google Sheets data regularly

### Performance Tips
- GitHub Pages is cached globally via CDN
- Your site will be fast worldwide
- Consider optimizing images if you add any

---

**Your donation tracker is now live and ready to use!**

Share the GitHub Pages URL with your authorized users, and they can start tracking donations immediately.
