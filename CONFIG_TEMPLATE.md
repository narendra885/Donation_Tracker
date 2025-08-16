# 🔧 Frontend Configuration Template

## When you get your Web App URL, I'll update these files automatically:

### js/config.js - Current State:
```javascript
const CONFIG = {
    // WAITING FOR YOUR WEB APP URL
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
    
    // Will be set to false for production
    DEMO_MODE: true,
    
    // Other settings
    APP_NAME: 'Donation Tracker',
    VERSION: '1.0.0',
    DEFAULT_YEAR: 2025,
    MOBILE_REGEX: /^\d{10}$/,
    DEBUG: true
};
```

### js/config.js - After Update:
```javascript
const CONFIG = {
    // YOUR ACTUAL WEB APP URL WILL GO HERE
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/[YOUR_ACTUAL_SCRIPT_ID]/exec',
    
    // Production mode enabled
    DEMO_MODE: false,
    
    // Other settings
    APP_NAME: 'Donation Tracker',
    VERSION: '1.0.0',
    DEFAULT_YEAR: 2025,
    MOBILE_REGEX: /^\d{10}$/,
    DEBUG: false  // Set to false for production
};
```

## 📱 Test Plan After Update:

1. **Login Test**: Try logging in with `8392680202`
2. **Dashboard Test**: Check if dashboard loads
3. **Add Donation Test**: Try adding a test donation
4. **Google Sheets Test**: Verify data appears in your spreadsheet
5. **Admin Panel Test**: Check user management works

## 🎯 Ready for GitHub Pages Deployment:

After the Web App URL is configured, all files will be ready for:
- GitHub repository upload
- GitHub Pages activation
- Live website at `https://yourusername.github.io/donation-tracker/`

---

**Share your Web App URL when ready, and I'll complete the configuration automatically!**
