// Configuration file for the donation tracker app

const CONFIG = {
    // Google Apps Script Web App URL
    // IMPORTANT: Replace this with your actual Google Apps Script Web App URL
    // after deploying the script as a web app
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwqPJUyCQrE6zL1WFZzD070IqaMMVxZJ0d_s3YOgtE4RjwnxwYIBDgtLNYmSNvmn1cG/exec',
    
    // Demo mode - dynamically determined by localStorage
    get DEMO_MODE() {
        const savedMode = localStorage.getItem('appMode');
        return savedMode === 'demo' ? true : false; // Default to live mode if not set
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
    },

    // Initialize default mode if not set
    initializeMode() {
        if (!localStorage.getItem('appMode')) {
            localStorage.setItem('appMode', 'demo');
        }
    }
};

// Export for use in other files

// Demo users for demo mode
CONFIG.DEMO_USERS = [
    { mobile: '8392680202', userName: 'Main Admin', role: 'admin' },
    { mobile: '9876543210', userName: 'Editor User', role: 'read_edit' },
    { mobile: '1234567890', userName: 'Reader User', role: 'read_only' },
    { mobile: '5555555555', userName: 'Test Admin', role: 'admin' },
    { mobile: '6666666666', userName: 'Test Editor', role: 'read_edit' },
    { mobile: '0123456789', userName: 'Main Admin', role: 'admin' }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
