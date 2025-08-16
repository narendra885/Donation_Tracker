# 🚀 Quick GitHub Deployment Guide

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com/new)
2. Repository name: `donation-tracker`
3. Make it **Public**
4. **DON'T** initialize with README (we have our files ready)
5. Click "Create repository"

## Step 2: Deploy Your Code

Open PowerShell/Command Prompt in your project folder and run:

```bash
# Set your GitHub username (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/donation-tracker.git
git branch -M main
git push -u origin main
```

**Replace YOUR_USERNAME with your actual GitHub username!**

## Step 3: Enable GitHub Pages

1. Go to your repository: `https://github.com/YOUR_USERNAME/donation-tracker`
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under "Source", select **"GitHub Actions"**
5. Wait 2-5 minutes for deployment

## Step 4: Access Your Live Application

🎯 **Your live URL will be**: `https://YOUR_USERNAME.github.io/donation-tracker`

## 📱 Demo Login Numbers

- **Admin**: `8392680202`
- **Editor**: `9876543210` 
- **Read-only**: `1234567890`

## 🔧 If You Get Errors

### Authentication Error:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@gmail.com"
```

### Repository Already Exists Error:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/donation-tracker.git
git push -u origin main
```

### Permission Denied:
- Make sure you're logged into GitHub
- Use GitHub Desktop or authenticate via browser

## 🎉 Success!

Once deployed, you'll have:
- ✅ Live donation tracker application
- ✅ Mobile-responsive design
- ✅ Demo data for immediate testing
- ✅ Ready for Google Sheets integration
- ✅ Free hosting forever

## Next Steps

1. **Test the demo** - Use the demo login numbers
2. **Configure Google Sheets** - Follow the setup guide for production use
3. **Customize** - Add your organization's branding
4. **Share** - Give the URL to your team

---

**Need help?** Open an issue on GitHub or check the README.md for detailed instructions.
