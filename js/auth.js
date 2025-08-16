// Authentication Manager for Donation Tracker

// Authentication handler
class AuthManager {
    constructor() {
        this.initializeAuth();
    }

    initializeAuth() {
        const form = document.getElementById('loginForm');
        const loginBtn = document.getElementById('loginBtn');
        const errorMessage = document.getElementById('errorMessage');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const mobileNumber = document.getElementById('mobileNumber').value.trim();
            
            if (!mobileNumber) {
                this.showError('Please enter your mobile number');
                return;
            }

            // Validate mobile number format using config
            if (!CONFIG.MOBILE_REGEX.test(mobileNumber)) {
                this.showError('Please enter a valid 10-digit mobile number');
                return;
            }

            // Show loading state
            this.setLoadingState(true);
            
            try {
                const authResult = await this.checkAuthorization(mobileNumber);
                
                if (authResult.success) {
                    // Store session
                    sessionStorage.setItem('userMobile', mobileNumber);
                    sessionStorage.setItem('isAuthenticated', 'true');
                    sessionStorage.setItem('loginTime', new Date().getTime());
                    sessionStorage.setItem('userRole', authResult.role);
                    
                    if (CONFIG.DEBUG) {
                        console.log('Login successful:', { mobile: mobileNumber, role: authResult.role });
                    }
                    
                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    this.showError(authResult.message || 'Mobile number not authorized. Please contact admin.');
                }
            } catch (error) {
                console.error('Authentication error:', error);
                this.showError('Unable to verify mobile number. Please try again.');
            } finally {
                this.setLoadingState(false);
            }
        });
    }

    async checkAuthorization(mobileNumber) {
        if (CONFIG.DEBUG) {
            console.log('Checking authorization for:', mobileNumber);
        }

        // Demo mode
        if (CONFIG.DEMO_MODE) {
            return this.checkDemoAuthorization(mobileNumber);
        }

        // Real Google Apps Script mode
        try {
            const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'authenticate',
                    mobile: mobileNumber
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (CONFIG.DEBUG) {
                console.log('Server response:', data);
            }

            return {
                success: data.success,
                role: data.role,
                message: data.message
            };
        } catch (error) {
            console.error('Server authorization check error:', error);
            return { 
                success: false, 
                message: `Connection error: ${error.message}` 
            };
        }
    }

    checkDemoAuthorization(mobileNumber) {
        if (CONFIG.DEBUG) {
            console.log('Demo mode: Checking against authorized numbers list');
        }
        
        // Demo authorized numbers
        const demoUsers = {
            '8392680202': { role: 'admin', userName: 'Main Admin' },
            '9876543210': { role: 'read_edit', userName: 'Editor User' },
            '1234567890': { role: 'read_only', userName: 'Reader User' }
        };

        const user = demoUsers[mobileNumber];
        if (user) {
            if (CONFIG.DEBUG) {
                console.log('Demo authorization successful:', user);
            }
            return {
                success: true,
                role: user.role,
                message: 'Authentication successful'
            };
        } else {
            if (CONFIG.DEBUG) {
                console.log('Demo authorization failed for:', mobileNumber);
            }
            return {
                success: false,
                message: 'Mobile number not authorized. Contact admin for access.'
            };
        }
    }

    // Helper method to get authorized numbers (demo mode)
    getAuthorizedNumbers() {
        // This method is kept for backward compatibility
        // In demo mode, we use predefined users
        const demoUsers = [
            { mobile: '8392680202', userName: 'Main Admin', role: 'admin', status: 'active' },
            { mobile: '9876543210', userName: 'Editor User', role: 'read_edit', status: 'active' },
            { mobile: '1234567890', userName: 'Reader User', role: 'read_only', status: 'active' }
        ];
        
        return demoUsers;
    }

    // Helper method to save authorized numbers (demo mode)
    static saveAuthorizedNumbers(numbers) {
        localStorage.setItem('demoAuthorizedNumbers', JSON.stringify(numbers));
    }

    // Helper method to get authorized numbers (static version for other classes)
    static getAuthorizedNumbers() {
        // In demo mode, return predefined users
        if (CONFIG.DEMO_MODE) {
            return [
                { mobile: '8392680202', userName: 'Main Admin', role: 'admin', status: 'active' },
                { mobile: '9876543210', userName: 'Editor User', role: 'read_edit', status: 'active' },
                { mobile: '1234567890', userName: 'Reader User', role: 'read_only', status: 'active' }
            ];
        }
        
        // In production mode, this would fetch from Google Sheets
        // For now, return empty array if not in demo mode
        return [];
    }

    // Helper function to get role display name
    static getRoleDisplayName(role) {
        const roleNames = {
            'admin': 'Admin',
            'read_edit': 'Read & Edit',
            'read_only': 'Read Only'
        };
        return roleNames[role] || 'Unknown';
    }

    // Helper function to get role badge
    static getRoleBadge(role) {
        const badges = {
            'admin': '👨‍💼',
            'read_edit': '✏️',
            'read_only': '👁️'
        };
        return badges[role] || '';
    }

    // Check if user has write permissions
    static hasWritePermission() {
        const userRole = sessionStorage.getItem('userRole');
        return userRole === 'admin' || userRole === 'read_edit';
    }

    // Check if user can edit data (alias for hasWritePermission)
    static canEditData() {
        return AuthManager.hasWritePermission();
    }

    // Check if user is admin
    static isAdmin() {
        const userRole = sessionStorage.getItem('userRole');
        console.log('Checking admin status - userRole:', userRole);
        return userRole === 'admin';
    }

    setLoadingState(loading) {
        const loginBtn = document.getElementById('loginBtn');
        const btnText = loginBtn.querySelector('.btn-text');
        const loader = loginBtn.querySelector('.loader');
        
        if (loading) {
            btnText.style.display = 'none';
            loader.style.display = 'block';
            loginBtn.disabled = true;
        } else {
            btnText.style.display = 'block';
            loader.style.display = 'none';
            loginBtn.disabled = false;
        }
    }

    showError(message) {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        // Hide error after 5 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }

    // Check if user is already authenticated
    static checkExistingSession() {
        const isAuthenticated = sessionStorage.getItem('isAuthenticated');
        const loginTime = sessionStorage.getItem('loginTime');
        
        if (isAuthenticated && loginTime) {
            const now = new Date().getTime();
            const sessionAge = now - parseInt(loginTime);
            const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
            
            if (sessionAge < maxSessionAge) {
                // Valid session exists, redirect to dashboard
                window.location.href = 'dashboard.html';
                return true;
            } else {
                // Session expired
                AuthManager.logout();
            }
        }
        return false;
    }

    // Logout function
    static logout() {
        sessionStorage.removeItem('userMobile');
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('loginTime');
        sessionStorage.removeItem('userRole'); // Clear role
        sessionStorage.removeItem('isAdmin'); // Clear old admin flag
        window.location.href = 'index.html';
    }

    // Require authentication for protected pages
    static requireAuth() {
        const isAuthenticated = sessionStorage.getItem('isAuthenticated');
        const loginTime = sessionStorage.getItem('loginTime');
        
        if (!isAuthenticated || !loginTime) {
            window.location.href = 'index.html';
            return false;
        }
        
        const now = new Date().getTime();
        const sessionAge = now - parseInt(loginTime);
        const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (sessionAge >= maxSessionAge) {
            AuthManager.logout();
            return false;
        }
        
        return true;
    }

    // Check admin privileges
    static requireAdmin() {
        if (!AuthManager.requireAuth()) {
            return false;
        }
        
        const userRole = sessionStorage.getItem('userRole');
        if (userRole !== 'admin') {
            window.location.href = 'dashboard.html';
            return false;
        }
        
        return true;
    }
}

// Initialize authentication when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize mode to live if not set
    CONFIG.initializeMode();
    
    // Initialize mode indicator on login page
    const modeIndicatorLogin = document.getElementById('modeIndicatorLogin');
    if (modeIndicatorLogin) {
        const currentMode = CONFIG.getCurrentMode();
        const isLiveMode = CONFIG.isLiveMode();
        
        modeIndicatorLogin.textContent = isLiveMode ? '🟢 Live Mode' : '🟡 Demo Mode';
        modeIndicatorLogin.className = `mode-indicator ${isLiveMode ? 'live' : 'demo'}`;
        modeIndicatorLogin.title = isLiveMode 
            ? 'Connected to Google Sheets - Data is saved permanently' 
            : 'Running in demo mode - Data is temporary';
    }
    
    // Only run on login page
    if (document.getElementById('loginForm')) {
        // Check if already authenticated
        if (!AuthManager.checkExistingSession()) {
            new AuthManager();
        }
    }
});

// Export for use in other modules
window.AuthManager = AuthManager;
