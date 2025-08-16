// Configuration file for the donation tracker app

const CONFIG = {
    // Google Apps Script Web App URL
    // IMPORTANT: Replace this with your actual Google Apps Script Web App URL
    // after deploying the script as a web app
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
    
    // Demo mode - set to false when connecting to real Google Sheets
    DEMO_MODE: true,
    
    // App settings
    APP_NAME: 'Donation Tracker',
    VERSION: '1.0.0',
    
    // Default settings
    DEFAULT_YEAR: new Date().getFullYear(),
    
    // Mobile number validation
    MOBILE_REGEX: /^\d{10}$/,
    
    // Debug mode
    DEBUG: true
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
