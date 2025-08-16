// Dashboard functionality
class DashboardManager {
    constructor() {
        // Require authentication
        if (!AuthManager.requireAuth()) {
            return;
        }

        // Use the main config instead of local config
        // this.CONFIG = {
        //     WEB_APP_URL: 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'
        // };

        this.donations = [];
        this.allDonations = []; // Store all donations for filtering
        this.currentYear = new Date().getFullYear(); // Default to current year
        this.stats = {
            totalDonations: 0,
            totalCommitments: 0,
            activeDonors: 0,
            pendingCommitments: 0
        };

        this.initializeDashboard();
        this.updateModeIndicator();
        this.loadDonations();
        
        // Auto-refresh every 30 seconds
        setInterval(() => this.loadDonations(), 30000);
    }

    initializeDashboard() {
        // Setup event listeners
        document.getElementById('logoutBtn').addEventListener('click', () => {
            AuthManager.logout();
        });

        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadDonations();
        });

        // Year filter event listener
        document.getElementById('yearSelect').addEventListener('change', (e) => {
            this.currentYear = parseInt(e.target.value);
            this.filterDonationsByYear();
        });

        // CSV export event listener
        document.getElementById('exportCsvBtn').addEventListener('click', () => {
            this.exportToCSV();
        });

        // Initialize year dropdown
        this.initializeYearDropdown();

        // Role-based UI setup
        const userRole = sessionStorage.getItem('userRole');
        
        // Only admin and read_edit users can add/edit/delete donations
        if (AuthManager.canEditData()) {
            document.getElementById('toggleAddForm').addEventListener('click', () => {
                this.toggleAddForm();
            });

            document.getElementById('cancelAdd').addEventListener('click', () => {
                this.hideAddForm();
            });

            document.getElementById('donationForm').addEventListener('submit', (e) => {
                this.handleDonationSubmit(e);
            });
        } else {
            // Hide add button for read-only users
            const addButton = document.getElementById('toggleAddForm');
            if (addButton) {
                addButton.style.display = 'none';
            }
        }

        // Check if user is admin and show admin link
        if (AuthManager.isAdmin()) {
            this.addAdminButton();
        }
    }

    addAdminButton() {
        const headerActions = document.querySelector('.header-actions');
        const adminBtn = document.createElement('button');
        adminBtn.id = 'adminBtn';
        adminBtn.className = 'btn-secondary';
        adminBtn.innerHTML = '👨‍💼 Admin';
        adminBtn.addEventListener('click', () => {
            window.location.href = 'admin.html';
        });
        headerActions.insertBefore(adminBtn, headerActions.firstChild);
    }

    updateModeIndicator() {
        const modeIndicator = document.getElementById('modeIndicator');
        if (!modeIndicator) return;

        const currentMode = CONFIG.getCurrentMode();
        const isLiveMode = CONFIG.isLiveMode();
        
        modeIndicator.textContent = isLiveMode ? '🟢 Live Mode' : '🟡 Demo Mode';
        modeIndicator.className = `mode-indicator ${isLiveMode ? 'live' : 'demo'}`;
        modeIndicator.title = isLiveMode 
            ? 'Connected to Google Sheets - Data is saved permanently' 
            : 'Running in demo mode - Data is temporary';
    }

    initializeYearDropdown() {
        const yearSelect = document.getElementById('yearSelect');
        const currentYear = new Date().getFullYear();
        
        // Add years from 2020 to current year + 2
        for (let year = 2020; year <= currentYear + 2; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            if (year === currentYear) {
                option.selected = true;
            }
            yearSelect.appendChild(option);
        }
    }

    filterDonationsByYear() {
        // Filter donations by selected year
        this.donations = this.allDonations.filter(donation => {
            const donationYear = new Date(donation.date).getFullYear();
            return donationYear === this.currentYear;
        });
        
        this.updateStats();
        this.renderDonationsTable();
    }

    exportToCSV() {
        // Show export modal
        document.getElementById('currentYearText').textContent = this.currentYear;
        document.getElementById('csvExportModal').style.display = 'flex';
    }

    confirmExport() {
        try {
            const exportType = document.querySelector('input[name="exportType"]:checked').value;
            let dataToExport;
            let filename;
            
            if (exportType === 'current') {
                dataToExport = this.donations; // Current year filtered data
                filename = `donations_${this.currentYear}_${new Date().toISOString().split('T')[0]}.csv`;
            } else {
                dataToExport = this.allDonations; // All years
                filename = `donations_all_years_${new Date().toISOString().split('T')[0]}.csv`;
            }
            
            if (dataToExport.length === 0) {
                this.showError('No data available to export');
                document.getElementById('csvExportModal').style.display = 'none';
                return;
            }

            // Create CSV content
            const headers = ['Donor Name', 'Phone Number', 'Amount Given', 'Amount Committed', 'Date', 'Notes', 'Added By'];
            const csvRows = [headers.join(',')];
            
            dataToExport.forEach(donation => {
                const row = [
                    `"${(donation.donorName || '').replace(/"/g, '""')}"`,
                    `"${(donation.donorPhone || '').replace(/"/g, '""')}"`,
                    parseFloat(donation.amountGiven || 0),
                    parseFloat(donation.amountCommitted || 0),
                    donation.date || '',
                    `"${(donation.notes || '').replace(/"/g, '""')}"`,
                    `"${(donation.addedBy || '').replace(/"/g, '""')}"`
                ];
                csvRows.push(row.join(','));
            });
            
            const csvContent = csvRows.join('\n');
            
            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            document.getElementById('csvExportModal').style.display = 'none';
            this.showSuccessMessage(`Exported ${dataToExport.length} donation records to CSV`);
        } catch (error) {
            console.error('Error exporting CSV:', error);
            this.showError('Failed to export CSV: ' + error.message);
        }
    }

    async loadDonations() {
        try {
            document.getElementById('loadingSpinner').style.display = 'block';
            document.getElementById('donationsTable').style.display = 'none';

            // Check if we're in demo mode (URL not configured)
            if (this.CONFIG.WEB_APP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
                console.log('Demo mode: Loading demo data');
                this.loadDemoData();
                return;
            }

            const response = await fetch(`${this.CONFIG.WEB_APP_URL}?action=getDonations`);
            const data = await response.json();

            if (data.success) {
                this.allDonations = data.donations || [];
                this.filterDonationsByYear(); // Apply year filter
            } else {
                throw new Error(data.error || 'Failed to load donations');
            }
        } catch (error) {
            console.error('Error loading donations:', error);
            this.loadDemoData(); // Fallback to demo data
        } finally {
            document.getElementById('loadingSpinner').style.display = 'none';
            document.getElementById('donationsTable').style.display = 'table';
        }
    }

    loadDemoData() {
        // Demo data for testing with various years
        this.allDonations = [
            {
                id: 1,
                donorName: 'John Smith',
                donorPhone: '1234567890',
                amountGiven: 500,
                amountCommitted: 1000,
                date: '2025-08-15',
                notes: 'Monthly donation',
                addedBy: '8392680202'
            },
            {
                id: 2,
                donorName: 'Jane Doe',
                donorPhone: '1987654321',
                amountGiven: 250,
                amountCommitted: 500,
                date: '2025-06-14',
                notes: 'Corporate sponsorship',
                addedBy: '8392680202'
            },
            {
                id: 3,
                donorName: 'Mike Johnson',
                donorPhone: '1122334455',
                amountGiven: 0,
                amountCommitted: 750,
                date: '2025-03-13',
                notes: 'Committed for next month',
                addedBy: '8392680202'
            },
            {
                id: 4,
                donorName: 'Sarah Wilson',
                donorPhone: '2233445566',
                amountGiven: 1000,
                amountCommitted: 1500,
                date: '2024-12-10',
                notes: 'Year-end donation',
                addedBy: '8392680202'
            },
            {
                id: 5,
                donorName: 'Robert Brown',
                donorPhone: '3344556677',
                amountGiven: 300,
                amountCommitted: 600,
                date: '2024-08-20',
                notes: 'Summer campaign',
                addedBy: '8392680202'
            },
            {
                id: 6,
                donorName: 'Emily Davis',
                donorPhone: '4455667788',
                amountGiven: 750,
                amountCommitted: 1000,
                date: '2023-11-05',
                notes: 'Annual contribution',
                addedBy: '8392680202'
            }
        ];
        this.filterDonationsByYear(); // Apply year filter to demo data
    }

    updateStats() {
        let totalDonations = 0;
        let totalCommitments = 0;
        let pendingCommitments = 0;
        const uniqueDonors = new Set();

        this.donations.forEach(donation => {
            totalDonations += parseFloat(donation.amountGiven || 0);
            totalCommitments += parseFloat(donation.amountCommitted || 0);
            
            if (donation.amountCommitted > donation.amountGiven) {
                pendingCommitments += parseFloat(donation.amountCommitted) - parseFloat(donation.amountGiven);
            }
            
            if (donation.donorName) {
                uniqueDonors.add(donation.donorName.toLowerCase());
            }
        });

        this.stats = {
            totalDonations,
            totalCommitments,
            activeDonors: uniqueDonors.size,
            pendingCommitments
        };

        // Update UI
        document.getElementById('totalDonations').textContent = `$${totalDonations.toLocaleString()}`;
        document.getElementById('totalCommitments').textContent = `$${totalCommitments.toLocaleString()}`;
        document.getElementById('activeDonors').textContent = this.stats.activeDonors;
        document.getElementById('pendingCommitments').textContent = `$${pendingCommitments.toLocaleString()}`;
    }

    renderDonationsTable() {
        const tbody = document.getElementById('donationsTableBody');
        tbody.innerHTML = '';

        if (this.donations.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #718096;">No donations found</td></tr>';
            return;
        }

        const canEdit = AuthManager.canEditData();

        this.donations.forEach(donation => {
            const row = document.createElement('tr');
            
            // Build action buttons based on user permissions
            let actionButtons = '';
            if (canEdit) {
                actionButtons = `
                    <button class="btn-secondary" onclick="dashboard.editDonation(${donation.id})" style="padding: 4px 8px; font-size: 12px;">Edit</button>
                    <button class="btn-danger" onclick="dashboard.deleteDonation(${donation.id})" style="padding: 4px 8px; font-size: 12px; margin-left: 4px;">Delete</button>
                `;
            } else {
                actionButtons = '<span style="color: #718096; font-size: 12px;">View Only</span>';
            }

            row.innerHTML = `
                <td>${donation.donorName || 'N/A'}</td>
                <td>${donation.donorPhone || 'N/A'}</td>
                <td>$${parseFloat(donation.amountGiven || 0).toLocaleString()}</td>
                <td>$${parseFloat(donation.amountCommitted || 0).toLocaleString()}</td>
                <td>${this.formatDate(donation.date)}</td>
                <td>${actionButtons}</td>
            `;
            tbody.appendChild(row);
        });
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }

    toggleAddForm() {
        const form = document.getElementById('addDonationForm');
        const isVisible = form.style.display !== 'none';
        
        if (isVisible) {
            this.hideAddForm();
        } else {
            this.showAddForm();
        }
    }

    showAddForm() {
        document.getElementById('addDonationForm').style.display = 'block';
        document.getElementById('toggleAddForm').textContent = '✕ Cancel';
        document.getElementById('donorName').focus();
    }

    hideAddForm() {
        document.getElementById('addDonationForm').style.display = 'none';
        document.getElementById('toggleAddForm').textContent = '+ Add Donation';
        document.getElementById('donationForm').reset();
    }

    async handleDonationSubmit(e) {
        e.preventDefault();
        
        // Check permissions
        if (!AuthManager.canEditData()) {
            this.showError('You do not have permission to add or edit donations');
            return;
        }
        
        const formData = new FormData(e.target);
        const donation = {
            donorName: formData.get('donorName') || document.getElementById('donorName').value,
            donorPhone: formData.get('donorPhone') || document.getElementById('donorPhone').value,
            amountGiven: parseFloat(document.getElementById('amountGiven').value) || 0,
            amountCommitted: parseFloat(document.getElementById('amountCommitted').value) || 0,
            notes: document.getElementById('notes').value,
            date: new Date().toISOString().split('T')[0],
            addedBy: sessionStorage.getItem('userMobile')
        };

        try {
            const response = await fetch(this.CONFIG.WEB_APP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'addDonation',
                    donation: donation
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.showSuccessMessage('Donation added successfully!');
                this.hideAddForm();
                this.loadDonations(); // Refresh the list
            } else {
                throw new Error(result.error || 'Failed to add donation');
            }
        } catch (error) {
            console.error('Error adding donation:', error);
            
            // For demo purposes, add to local arrays
            donation.id = Date.now();
            this.allDonations.unshift(donation);
            this.filterDonationsByYear(); // Refresh filtered view
            this.showSuccessMessage('Donation added successfully! (Demo mode)');
            this.hideAddForm();
        }
    }

    async editDonation(id) {
        // Check permissions
        if (!AuthManager.canEditData()) {
            this.showError('You do not have permission to edit donations');
            return;
        }

        const donation = this.donations.find(d => d.id == id);
        if (!donation) return;

        // Pre-fill form with existing data
        document.getElementById('donorName').value = donation.donorName || '';
        document.getElementById('donorPhone').value = donation.donorPhone || '';
        document.getElementById('amountGiven').value = donation.amountGiven || '';
        document.getElementById('amountCommitted').value = donation.amountCommitted || '';
        document.getElementById('notes').value = donation.notes || '';
        
        this.showAddForm();
        
        // Change form to edit mode
        const form = document.getElementById('donationForm');
        form.dataset.editId = id;
        document.querySelector('#donationForm button[type="submit"]').textContent = 'Update Donation';
    }

    async deleteDonation(id) {
        // Check permissions
        if (!AuthManager.canEditData()) {
            this.showError('You do not have permission to delete donations');
            return;
        }

        if (!confirm('Are you sure you want to delete this donation?')) return;

        try {
            const response = await fetch(this.CONFIG.WEB_APP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'deleteDonation',
                    id: id
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.showSuccessMessage('Donation deleted successfully!');
                this.loadDonations();
            } else {
                throw new Error(result.error || 'Failed to delete donation');
            }
        } catch (error) {
            console.error('Error deleting donation:', error);
            
            // For demo purposes, remove from local array
            this.donations = this.donations.filter(d => d.id != id);
            this.updateStats();
            this.renderDonationsTable();
            this.showSuccessMessage('Donation deleted successfully! (Demo mode)');
        }
    }

    showSuccessMessage(message) {
        // Create success message element
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.position = 'fixed';
        successDiv.style.top = '20px';
        successDiv.style.right = '20px';
        successDiv.style.zIndex = '1000';
        
        document.body.appendChild(successDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (document.body.contains(successDiv)) {
                document.body.removeChild(successDiv);
            }
        }, 3000);
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new DashboardManager();
});
