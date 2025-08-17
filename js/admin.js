// Admin panel functionality
class AdminManager {
    constructor() {
        // Require admin authentication
        if (!AuthManager.requireAdmin()) {
            return;
        }

        this.CONFIG = {
            WEB_APP_URL: 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'
        };

        this.authorizedNumbers = [];
        this.initializeAdmin();
        this.loadAuthorizedNumbers();
    }

    initializeAdmin() {
        // Setup event listeners
        document.getElementById('logoutBtn').addEventListener('click', () => {
            AuthManager.logout();
        });

        document.getElementById('backToDashboard').addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });

        document.getElementById('addNumberBtn').addEventListener('click', () => {
            this.toggleAddNumberForm();
        });

        document.getElementById('cancelAddNumber').addEventListener('click', () => {
            this.hideAddNumberForm();
        });

        document.getElementById('numberForm').addEventListener('submit', (e) => {
            this.handleAddNumber(e);
        });

        document.getElementById('configureSheets').addEventListener('click', () => {
            this.showSheetsConfiguration();
        });

        document.getElementById('exportData').addEventListener('click', () => {
            this.exportData();
        });

        // Mode toggle functionality
        document.getElementById('modeToggle').addEventListener('change', (e) => {
            this.toggleMode(e.target.checked);
        });

        // Initialize mode display
        this.updateModeDisplay();
    }

    async loadAuthorizedNumbers() {
        try {
            // Check if we're in demo mode (URL not configured)
            if (this.CONFIG.WEB_APP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
                console.log('Demo mode: Loading authorized numbers from localStorage');
                this.authorizedNumbers = AuthManager.getAuthorizedNumbers();
                this.renderNumbersTable();
                return;
            }

            const response = await fetch(`${this.CONFIG.WEB_APP_URL}?action=getAuthorizedNumbers`);
            const data = await response.json();

            if (data.success) {
                this.authorizedNumbers = data.numbers || [];
                this.renderNumbersTable();
            } else {
                throw new Error(data.error || 'Failed to load authorized numbers');
            }
        } catch (error) {
            console.error('Error loading authorized numbers:', error);
            // Fallback to demo data
            this.authorizedNumbers = AuthManager.getAuthorizedNumbers();
            this.renderNumbersTable();
        }
    }

    renderNumbersTable() {
        const tbody = document.getElementById('numbersTableBody');
        tbody.innerHTML = '';

        if (this.authorizedNumbers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #718096;">No authorized numbers found</td></tr>';
            return;
        }

        this.authorizedNumbers.forEach(number => {
            const row = document.createElement('tr');
            const statusClass = number.status === 'active' ? 'status-active' : 'status-inactive';
            const roleBadge = AuthManager.getRoleBadge(number.role);
            const roleDisplay = AuthManager.getRoleDisplayName(number.role);
            
            // Check if current user is admin (can modify others)
            const currentUserMobile = sessionStorage.getItem('userMobile');
            const isMainAdmin = currentUserMobile === '8392680202';
            const canModify = AuthManager.isAdmin();
            
            row.innerHTML = `
                <td>${number.mobile} ${roleBadge}</td>
                <td>${number.userName || 'N/A'}</td>
                <td><span class="role-badge role-${number.role}">${roleDisplay}</span></td>
                <td>${this.formatDate(number.addedDate)}</td>
                <td><span class="status-badge ${statusClass}">${number.status}</span></td>
                <td>
                    ${canModify ? `
                        ${isMainAdmin && number.mobile !== '8392680202' ? `
                            <button class="btn-secondary" onclick="admin.editUser(${number.id})" style="padding: 4px 8px; font-size: 12px; background: #28a745;">
                                Edit
                            </button>
                        ` : ''}
                        <button class="btn-secondary" onclick="admin.toggleNumberStatus(${number.id})" style="padding: 4px 8px; font-size: 12px; margin-left: 4px;">
                            ${number.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        ${isMainAdmin && number.mobile !== '8392680202' ? `
                            <button class="btn-secondary" onclick="admin.changeUserRole(${number.id})" style="padding: 4px 8px; font-size: 12px; margin-left: 4px; background: #4299e1;">
                                Change Role
                            </button>
                        ` : ''}
                        ${number.role !== 'admin' ? `
                            <button class="btn-danger" onclick="admin.deleteNumber(${number.id})" style="padding: 4px 8px; font-size: 12px; margin-left: 4px;">Delete</button>
                        ` : ''}
                    ` : `
                        <span style="color: #718096; font-size: 12px;">No permissions</span>
                    `}
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }

    toggleAddNumberForm() {
        const form = document.getElementById('addNumberForm');
        const isVisible = form.style.display !== 'none';
        
        if (isVisible) {
            this.hideAddNumberForm();
        } else {
            this.showAddNumberForm();
        }
    }

    editUser(id) {
        const user = this.authorizedNumbers.find(n => n.id == id);
        if (!user) {
            this.showError('User not found');
            return;
        }

        // Only the main admin can edit users
        const currentUserMobile = sessionStorage.getItem('userMobile');
        if (currentUserMobile !== '8392680202') {
            this.showError('Only the main admin can edit user details');
            return;
        }

        // Cannot edit main admin
        if (user.mobile === '8392680202') {
            this.showError('Cannot edit main admin details');
            return;
        }

        // Show add form and populate with current data
        this.showAddNumberForm();
        
        // Fill the form with existing data
        document.getElementById('newMobileNumber').value = user.mobile;
        document.getElementById('userName').value = user.userName;
        document.getElementById('userRole').value = user.role;
        
        // Make mobile number readonly to prevent changes
        document.getElementById('newMobileNumber').setAttribute('readonly', true);
        document.getElementById('newMobileNumber').style.backgroundColor = '#f8f9fa';
        
        // Change form title and button text
        document.querySelector('#addNumberForm h3').textContent = 'Edit User Details';
        document.querySelector('#addNumberForm button[type="submit"]').textContent = 'Update User';
        
        // Store the edit ID for form submission
        document.getElementById('addNumberForm').dataset.editId = id;
    }

    showAddNumberForm() {
        document.getElementById('addNumberForm').style.display = 'block';
        document.getElementById('addNumberBtn').textContent = '✕ Cancel';
        document.getElementById('newMobileNumber').focus();
    }

    hideAddNumberForm() {
        document.getElementById('addNumberForm').style.display = 'none';
        document.getElementById('addNumberBtn').textContent = '+ Add Number';
        document.getElementById('numberForm').reset();
        
        // Reset form state
        document.getElementById('newMobileNumber').removeAttribute('readonly');
        document.getElementById('newMobileNumber').style.backgroundColor = '';
        document.querySelector('#addNumberForm h3').textContent = 'Add New User';
        document.querySelector('#addNumberForm button[type="submit"]').textContent = 'Add User';
        delete document.getElementById('addNumberForm').dataset.editId;
        
        // Reset role to default
        document.getElementById('userRole').value = 'read_only';
    }

    async handleAddNumber(e) {
        e.preventDefault();
        
        const mobile = document.getElementById('newMobileNumber').value.trim();
        const userName = document.getElementById('userName').value.trim();
        const userRole = document.getElementById('userRole').value || 'read_only'; // Default to read_only
        const isEditing = e.target.dataset.editId;

        if (!mobile || !userName) {
            this.showError('Please fill in all required fields');
            return;
        }

        // Validate mobile number format (10 digits)
        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(mobile)) {
            this.showError('Please enter a valid 10-digit mobile number (e.g., 8392680202)');
            return;
        }

        // If editing, update the existing user
        if (isEditing) {
            return this.updateExistingUser(parseInt(isEditing), { userName, role: userRole });
        }

        // Check if number already exists (for new users)
        const existingUser = this.authorizedNumbers.find(num => num.mobile === mobile);
        if (existingUser) {
            // If user exists, ask if they want to update the user details
            const updateUser = confirm(`Mobile number ${mobile} (${existingUser.userName}) already exists with role: ${AuthManager.getRoleDisplayName(existingUser.role)}.\n\nDo you want to update their details?\nName: ${existingUser.userName} → ${userName}\nRole: ${AuthManager.getRoleDisplayName(existingUser.role)} → ${AuthManager.getRoleDisplayName(userRole)}`);
            
            if (updateUser) {
                return this.updateExistingUser(existingUser.id, { userName, role: userRole });
            } else {
                this.showError('Mobile number already exists. Operation cancelled.');
                return;
            }
        }

        const newNumber = {
            id: Date.now(), // Use timestamp as ID
            mobile: mobile,
            userName: userName,
            role: userRole,
            addedDate: new Date().toISOString().split('T')[0],
            status: 'active',
            addedBy: sessionStorage.getItem('userMobile')
        };

        try {
            // Check if we're in demo mode
            if (this.CONFIG.WEB_APP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
                console.log('Demo mode: Adding number to localStorage');
                this.authorizedNumbers.unshift(newNumber);
                AuthManager.saveAuthorizedNumbers(this.authorizedNumbers);
                this.renderNumbersTable();
                this.showSuccessMessage(`Mobile number added successfully as ${AuthManager.getRoleDisplayName(userRole)}! (Demo mode)`);
                this.hideAddNumberForm();
                return;
            }

            const response = await fetch(this.CONFIG.WEB_APP_URL, {
                method: 'POST',
                body: (() => {
                    const form = new FormData();
                    form.append('action', 'addAuthorizedNumber');
                    form.append('number', JSON.stringify(newNumber));
                    return form;
                })()
            });

            const result = await response.json();
            
            if (result.success) {
                this.showSuccessMessage(`Mobile number added successfully as ${AuthManager.getRoleDisplayName(userRole)}!`);
                this.hideAddNumberForm();
                this.loadAuthorizedNumbers(); // Refresh the list
            } else {
                throw new Error(result.error || 'Failed to add mobile number');
            }
        } catch (error) {
            console.error('Error adding mobile number:', error);
            this.showError('Failed to add mobile number: ' + error.message);
        }
    }

    async updateExistingUser(id, updates) {
        const user = this.authorizedNumbers.find(n => n.id == id);
        if (!user) {
            this.showError('User not found');
            return;
        }

        // Only the main admin can update users
        const currentUserMobile = sessionStorage.getItem('userMobile');
        if (currentUserMobile !== '8392680202') {
            this.showError('Only the main admin can update user details');
            return;
        }

        // Cannot update main admin
        if (user.mobile === '8392680202') {
            this.showError('Cannot update main admin details');
            return;
        }

        try {
            // Check if we're in demo mode
            if (this.CONFIG.WEB_APP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
                console.log('Demo mode: Updating user in localStorage');
                
                // Update user details
                if (updates.userName) user.userName = updates.userName;
                if (updates.role) user.role = updates.role;
                user.updatedBy = currentUserMobile;
                user.updatedDate = new Date().toISOString().split('T')[0];
                
                AuthManager.saveAuthorizedNumbers(this.authorizedNumbers);
                this.renderNumbersTable();
                this.showSuccessMessage(`User details updated successfully! (Demo mode)`);
                this.hideAddNumberForm();
                return;
            }

            const response = await fetch(this.CONFIG.WEB_APP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'updateUser',
                    id: id,
                    updates: updates
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.showSuccessMessage(`User details updated successfully!`);
                this.loadAuthorizedNumbers();
                this.hideAddNumberForm();
            } else {
                throw new Error(result.error || `Failed to update user details`);
            }
        } catch (error) {
            console.error(`Error updating user:`, error);
            this.showError(`Failed to update user: ` + error.message);
        }
    }

    async changeUserRole(id) {
        const number = this.authorizedNumbers.find(n => n.id == id);
        if (!number) return;

        // Only the main admin can change roles
        const currentUserMobile = sessionStorage.getItem('userMobile');
        if (currentUserMobile !== '8392680202') {
            this.showError('Only the main admin can change user roles');
            return;
        }

        // Cannot change role of main admin
        if (number.mobile === '8392680202') {
            this.showError('Cannot change role of main admin');
            return;
        }

        // Create role selection dialog
        const newRole = prompt(`Change role for ${number.userName}:\n\n1. admin (Admin - Full Access)\n2. read_edit (Read & Edit - Can modify data)\n3. read_only (Read Only - View only)\n\nEnter role (admin/read_edit/read_only):`, number.role);
        
        if (!newRole || !['admin', 'read_edit', 'read_only'].includes(newRole)) {
            this.showError('Invalid role. Please enter: admin, read_edit, or read_only');
            return;
        }

        if (newRole === number.role) {
            this.showError('User already has this role');
            return;
        }

        try {
            // Check if we're in demo mode
            if (this.CONFIG.WEB_APP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
                console.log('Demo mode: Updating user role in localStorage');
                number.role = newRole;
                AuthManager.saveAuthorizedNumbers(this.authorizedNumbers);
                this.renderNumbersTable();
                this.showSuccessMessage(`User role changed to ${AuthManager.getRoleDisplayName(newRole)} successfully! (Demo mode)`);
                return;
            }

            const response = await fetch(this.CONFIG.WEB_APP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'updateUserRole',
                    id: id,
                    role: newRole
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.showSuccessMessage(`User role changed to ${AuthManager.getRoleDisplayName(newRole)} successfully!`);
                this.loadAuthorizedNumbers();
            } else {
                throw new Error(result.error || `Failed to update user role`);
            }
        } catch (error) {
            console.error(`Error updating user role:`, error);
            this.showError(`Failed to update user role: ` + error.message);
        }
    }

    async toggleNumberStatus(id) {
        const number = this.authorizedNumbers.find(n => n.id == id);
        if (!number) return;

        const newStatus = number.status === 'active' ? 'inactive' : 'active';
        const action = newStatus === 'active' ? 'activate' : 'deactivate';

        if (!confirm(`Are you sure you want to ${action} this mobile number?`)) return;

        try {
            // Check if we're in demo mode
            if (this.CONFIG.WEB_APP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
                console.log('Demo mode: Updating number status in localStorage');
                number.status = newStatus;
                AuthManager.saveAuthorizedNumbers(this.authorizedNumbers);
                this.renderNumbersTable();
                this.showSuccessMessage(`Mobile number ${action}d successfully! (Demo mode)`);
                return;
            }

            const response = await fetch(this.CONFIG.WEB_APP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'updateNumberStatus',
                    id: id,
                    status: newStatus
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.showSuccessMessage(`Mobile number ${action}d successfully!`);
                this.loadAuthorizedNumbers();
            } else {
                throw new Error(result.error || `Failed to ${action} mobile number`);
            }
        } catch (error) {
            console.error(`Error ${action}ing mobile number:`, error);
            this.showError(`Failed to ${action} mobile number: ` + error.message);
        }
    }

    async deleteNumber(id) {
        const number = this.authorizedNumbers.find(n => n.id == id);
        if (!number) return;

        if (number.isAdmin) {
            this.showError('Cannot delete admin numbers');
            return;
        }

        if (!confirm('Are you sure you want to delete this mobile number?')) return;

        try {
            // Check if we're in demo mode
            if (this.CONFIG.WEB_APP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
                console.log('Demo mode: Deleting number from localStorage');
                this.authorizedNumbers = this.authorizedNumbers.filter(n => n.id != id);
                AuthManager.saveAuthorizedNumbers(this.authorizedNumbers);
                this.renderNumbersTable();
                this.showSuccessMessage('Mobile number deleted successfully! (Demo mode)');
                return;
            }

            const response = await fetch(this.CONFIG.WEB_APP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'deleteAuthorizedNumber',
                    id: id
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.showSuccessMessage('Mobile number deleted successfully!');
                this.loadAuthorizedNumbers();
            } else {
                throw new Error(result.error || 'Failed to delete mobile number');
            }
        } catch (error) {
            console.error('Error deleting mobile number:', error);
            this.showError('Failed to delete mobile number: ' + error.message);
        }
    }

    showSheetsConfiguration() {
        const spreadsheetId = prompt('Enter your Google Sheets Spreadsheet ID:', '');
        if (spreadsheetId) {
            document.getElementById('spreadsheetId').textContent = spreadsheetId;
            localStorage.setItem('spreadsheetId', spreadsheetId);
            this.showSuccessMessage('Google Sheets configuration updated!');
        }
    }

    async exportData() {
        try {
            // Get all donation data
            const response = await fetch(`${this.CONFIG.WEB_APP_URL}?action=getDonations`);
            const data = await response.json();
            
            let donations = [];
            if (data.success) {
                donations = data.donations || [];
            } else {
                // Use demo data for export
                donations = [
                    {
                        donorName: 'John Smith',
                        donorPhone: '+1234567890',
                        amountGiven: 500,
                        amountCommitted: 1000,
                        date: '2025-08-15',
                        notes: 'Monthly donation'
                    },
                    {
                        donorName: 'Jane Doe',
                        donorPhone: '+1987654321',
                        amountGiven: 250,
                        amountCommitted: 500,
                        date: '2025-08-14',
                        notes: 'Corporate sponsorship'
                    }
                ];
            }

            // Create CSV content
            const csvHeader = 'Donor Name,Phone,Amount Given,Amount Committed,Date,Notes\n';
            const csvContent = donations.map(donation => {
                return `"${donation.donorName || ''}","${donation.donorPhone || ''}","${donation.amountGiven || 0}","${donation.amountCommitted || 0}","${donation.date || ''}","${donation.notes || ''}"`;
            }).join('\n');

            const csv = csvHeader + csvContent;

            // Download CSV file
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `donations_export_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            this.showSuccessMessage('Data exported successfully!');
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showError('Failed to export data');
        }
    }

    // Mode Toggle Methods
    updateModeDisplay() {
        const currentMode = localStorage.getItem('appMode') || 'demo';
        const isLiveMode = currentMode === 'live';
        
        const currentModeElement = document.getElementById('currentMode');
        const modeToggle = document.getElementById('modeToggle');
        const modeLabel = document.getElementById('modeLabel');
        
        // Update current mode display
        currentModeElement.textContent = isLiveMode ? 'Live Mode' : 'Demo Mode';
        currentModeElement.className = `mode-indicator ${isLiveMode ? 'live' : 'demo'}`;
        
        // Update toggle switch
        modeToggle.checked = isLiveMode;
        
        // Update label
        modeLabel.textContent = isLiveMode ? 'Live Mode' : 'Demo Mode';
    }

    toggleMode(isLiveMode) {
        const newMode = isLiveMode ? 'live' : 'demo';
        
        // Show confirmation dialog
        const message = isLiveMode 
            ? 'Switch to Live Mode? Data will be stored in Google Sheets permanently.' 
            : 'Switch to Demo Mode? Data will be stored locally (temporary).';
            
        if (confirm(message)) {
            // Save the mode preference
            localStorage.setItem('appMode', newMode);
            
            // Update display
            this.updateModeDisplay();
            
            // Show success message
            this.showSuccessMessage(`Switched to ${isLiveMode ? 'Live' : 'Demo'} Mode successfully!`);
            
            // Optionally reload the page to apply changes
            setTimeout(() => {
                if (confirm('Reload the page to apply the mode change?')) {
                    window.location.reload();
                }
            }, 1500);
        } else {
            // Reset toggle if cancelled
            this.updateModeDisplay();
        }
    }

    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.position = 'fixed';
        successDiv.style.top = '20px';
        successDiv.style.right = '20px';
        successDiv.style.zIndex = '1000';
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            if (document.body.contains(successDiv)) {
                document.body.removeChild(successDiv);
            }
        }, 3000);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.position = 'fixed';
        errorDiv.style.top = '20px';
        errorDiv.style.right = '20px';
        errorDiv.style.zIndex = '1000';
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (document.body.contains(errorDiv)) {
                document.body.removeChild(errorDiv);
            }
        }, 5000);
    }
}

// Initialize admin panel when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.admin = new AdminManager();
});
