// Configuration file for the donation tracker app

const CONFIG = {
    // Google Apps Script Web App URL
    // IMPORTANT: Replace this with your actual Google Apps Script Web App URL
    // after deploying the script as a web app
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwqPJUyCQrE6zL1WFZzD070IqaMMVxZJ0d_s3YOgtE4RjwnxwYIBDgtLNYmSNvmn1cG/exec',
    
    // Demo mode - dynamically determined by localStorage
    get DEMO_MODE() {
        const savedMode = localStorage.getItem('appMode');
        return savedMode === 'live' ? false : true; // Default to demo mode if not set
    },
    
    // App settings
    APP_NAME: 'Donation Tracker',
    VERSION: '1.0.0',
    
    // Default settings
    DEFAULT_YEAR: new Date().getFullYear(),
    
    // Mobile number validation
    MOBILE_REGEX: /^\d{10}$/,
    
    // Debug mode
    DEBUG: true,

    // Mode helper functions
    getCurrentMode() {
        return this.DEMO_MODE ? 'demo' : 'live';
    },

    isLiveMode() {
        return !this.DEMO_MODE;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
