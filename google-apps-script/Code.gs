/**
 * Google Apps Script for Donation Tracker Backend with Yearly Organization
 * 
 * This script handles:
 * - Authentication via mobile numbers with role-based access
 * - CRUD operations for donations organized by year
 * - Managing authorized users with 3-tier roles (admin, read_edit, read_only)
 * - Automatic yearly sheet creation
 * - Data storage in Google Sheets
 * 
 * Setup Instructions:
 * 1. Create a new Google Apps Script project
 * 2. Paste this code into Code.gs
 * 3. Create a Google Sheet and note the Sheet ID
 * 4. Update the SPREADSHEET_ID variable below
 * 5. Deploy as Web App with execute permissions set to "Anyone"
 * 6. Copy the Web App URL to your frontend CONFIG
 */

// Configuration - Update these values
// Configuration
const SPREADSHEET_ID = '1-mYbsZ3CdevtXT1A3_mndUpUZoJ50h8riwDuRlaWcMA';
const AUTHORIZED_USERS_SHEET_NAME = 'AuthorizedUsers';

// Get or create year-specific sheet for donations
function getYearSheet(year) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheetName = `Donations_${year}`;
  
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    // Create new sheet for the year
    sheet = ss.insertSheet(sheetName);
    sheet.getRange(1, 1, 1, 8).setValues([[
      'ID', 'Donor Name', 'Donor Phone', 'Amount Given', 'Amount Committed', 'Date', 'Notes', 'Added By'
    ]]);
    sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
    
    // Set column widths for better display
    sheet.setColumnWidth(1, 100); // ID
    sheet.setColumnWidth(2, 150); // Donor Name
    sheet.setColumnWidth(3, 120); // Phone
    sheet.setColumnWidth(4, 120); // Amount Given
    sheet.setColumnWidth(5, 140); // Amount Committed
    sheet.setColumnWidth(6, 100); // Date
    sheet.setColumnWidth(7, 200); // Notes
    sheet.setColumnWidth(8, 120); // Added By
  }
  
  return sheet;
}

// Initialize spreadsheet structure
function initializeSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Create current year donations sheet
  const currentYear = new Date().getFullYear();
  getYearSheet(currentYear);
  
  // Create Authorized Users sheet if it doesn't exist
  let usersSheet = ss.getSheetByName(AUTHORIZED_USERS_SHEET_NAME);
  if (!usersSheet) {
    usersSheet = ss.insertSheet(AUTHORIZED_USERS_SHEET_NAME);
    usersSheet.getRange(1, 1, 1, 6).setValues([[
      'ID', 'Mobile', 'User Name', 'Role', 'Status', 'Added Date'
    ]]);
    usersSheet.getRange(1, 1, 1, 6).setFontWeight('bold');
    
    // Add default admin user (update mobile number as needed)
    usersSheet.getRange(2, 1, 1, 6).setValues([[
      1, '8392680202', 'Main Admin', 'admin', 'active', new Date().toISOString().split('T')[0]
    ]]);
  }
}

// Main function to handle all requests
function doGet(e) {
  const action = e.parameter.action;
  
  try {
    switch (action) {
      case 'checkAuth':
        return handleCheckAuth(e.parameter.mobile);
      case 'getDonations':
        return handleGetDonations(e.parameter.year);
      case 'getAuthorizedNumbers':
        return handleGetAuthorizedNumbers();
      case 'getAllYears':
        return handleGetAllYears();
      default:
        return createResponse(false, 'Invalid action');
    }
  } catch (error) {
    console.error('doGet error:', error);
    return createResponse(false, error.message);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch (action) {
      case 'addDonation':
        return handleAddDonation(data.donation);
      case 'updateDonation':
        return handleUpdateDonation(data.donation);
      case 'deleteDonation':
        return handleDeleteDonation(data.id, data.year);
      case 'addAuthorizedNumber':
        return handleAddAuthorizedNumber(data.number);
      case 'deleteAuthorizedNumber':
        return handleDeleteAuthorizedNumber(data.id);
      case 'updateUserRole':
        return handleUpdateUserRole(data.id, data.role);
      case 'updateNumberStatus':
        return handleUpdateNumberStatus(data.id, data.status);
      default:
        return createResponse(false, 'Invalid action');
    }
  } catch (error) {
    console.error('doPost error:', error);
    return createResponse(false, error.message);
  }
}

// Authentication functions
function handleCheckAuth(mobile) {
  if (!mobile) {
    return createResponse(false, 'Mobile number required');
  }
  
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(AUTHORIZED_USERS_SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === mobile && data[i][4] === 'active') {
      return createResponse(true, 'Authorized', { 
        authorized: true, 
        role: data[i][3] || 'read_only',
        userName: data[i][2] || 'User'
      });
    }
  }
  
  return createResponse(true, 'Not authorized', { authorized: false });
}

// Get all available years that have donation data
function handleGetAllYears() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheets = ss.getSheets();
    const years = [];
    
    sheets.forEach(sheet => {
      const sheetName = sheet.getName();
      if (sheetName.startsWith('Donations_')) {
        const year = sheetName.replace('Donations_', '');
        if (!isNaN(year) && year.length === 4) {
          years.push(parseInt(year));
        }
      }
    });
    
    // Sort years in descending order (newest first)
    years.sort((a, b) => b - a);
    
    // If no years found, add current year
    if (years.length === 0) {
      const currentYear = new Date().getFullYear();
      years.push(currentYear);
    }
    
    return createResponse(true, 'Years retrieved', { years });
  } catch (error) {
    console.error('Error getting years:', error);
    return createResponse(false, error.message);
  }
}

// Donation functions
function handleGetDonations(year) {
  try {
    // Use current year if no year specified
    const targetYear = year || new Date().getFullYear();
    const sheet = getYearSheet(targetYear);
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createResponse(true, 'No donations found', { donations: [], year: targetYear });
    }
    
    const donations = [];
    for (let i = 1; i < data.length; i++) {
      donations.push({
        id: data[i][0],
        donorName: data[i][1],
        donorPhone: data[i][2],
        amountGiven: data[i][3],
        amountCommitted: data[i][4],
        date: data[i][5],
        notes: data[i][6],
        addedBy: data[i][7]
      });
    }
    
    // Sort by date (newest first)
    donations.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return createResponse(true, 'Donations retrieved', { donations, year: targetYear });
  } catch (error) {
    console.error('Error getting donations:', error);
    return createResponse(false, error.message);
  }
}

function handleAddDonation(donation) {
  if (!donation || !donation.donorName) {
    return createResponse(false, 'Donor name is required');
  }
  
  try {
    // Determine year from donation date
    const donationDate = donation.date || new Date().toISOString().split('T')[0];
    const year = new Date(donationDate).getFullYear();
    
    const sheet = getYearSheet(year);
    const id = new Date().getTime(); // Use timestamp as ID
    
    sheet.appendRow([
      id,
      donation.donorName,
      donation.donorPhone || '',
      parseFloat(donation.amountGiven) || 0,
      parseFloat(donation.amountCommitted) || 0,
      donationDate,
      donation.notes || '',
      donation.addedBy || ''
    ]);
    
    return createResponse(true, 'Donation added successfully', { id, year });
  } catch (error) {
    console.error('Error adding donation:', error);
    return createResponse(false, error.message);
  }
}

function handleUpdateDonation(donation) {
  if (!donation || !donation.id || !donation.donorName) {
    return createResponse(false, 'Donation ID and donor name are required');
  }
  
  try {
    // Determine year from donation date
    const donationDate = donation.date || new Date().toISOString().split('T')[0];
    const year = new Date(donationDate).getFullYear();
    
    const sheet = getYearSheet(year);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == donation.id) {
        sheet.getRange(i + 1, 1, 1, 8).setValues([[
          donation.id,
          donation.donorName,
          donation.donorPhone || '',
          parseFloat(donation.amountGiven) || 0,
          parseFloat(donation.amountCommitted) || 0,
          donationDate,
          donation.notes || '',
          donation.addedBy || ''
        ]]);
        return createResponse(true, 'Donation updated successfully');
      }
    }
    
    return createResponse(false, 'Donation not found');
  } catch (error) {
    console.error('Error updating donation:', error);
    return createResponse(false, error.message);
  }
}

function handleDeleteDonation(id, year) {
  if (!id) {
    return createResponse(false, 'Donation ID is required');
  }
  
  try {
    // Use current year if not specified
    const targetYear = year || new Date().getFullYear();
    const sheet = getYearSheet(targetYear);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        sheet.deleteRow(i + 1);
        return createResponse(true, 'Donation deleted successfully');
      }
    }
    
    return createResponse(false, 'Donation not found');
  } catch (error) {
    console.error('Error deleting donation:', error);
    return createResponse(false, error.message);
  }
}

// Authorized users functions
function handleGetAuthorizedNumbers() {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(AUTHORIZED_USERS_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createResponse(true, 'No authorized numbers found', { numbers: [] });
    }
    
    const numbers = [];
    for (let i = 1; i < data.length; i++) {
      numbers.push({
        id: data[i][0],
        mobile: data[i][1],
        userName: data[i][2],
        role: data[i][3] || 'read_only',
        status: data[i][4],
        addedDate: data[i][5]
      });
    }
    
    return createResponse(true, 'Authorized numbers retrieved', { numbers });
  } catch (error) {
    console.error('Error getting authorized numbers:', error);
    return createResponse(false, error.message);
  }
}

function handleAddAuthorizedNumber(number) {
  if (!number || !number.mobile || !number.userName) {
    return createResponse(false, 'Mobile number and user name are required');
  }
  
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(AUTHORIZED_USERS_SHEET_NAME);
    
    // Check if mobile number already exists
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === number.mobile) {
        return createResponse(false, 'Mobile number already exists');
      }
    }
    
    const id = new Date().getTime(); // Use timestamp as ID
    
    sheet.appendRow([
      id,
      number.mobile,
      number.userName,
      number.role || 'read_only',
      number.status || 'active',
      number.addedDate || new Date().toISOString().split('T')[0]
    ]);
    
    return createResponse(true, 'Authorized number added successfully', { id });
  } catch (error) {
    console.error('Error adding authorized number:', error);
    return createResponse(false, error.message);
  }
}

function handleUpdateUserRole(id, role) {
  if (!id || !role) {
    return createResponse(false, 'ID and role are required');
  }
  
  const validRoles = ['admin', 'read_edit', 'read_only'];
  if (!validRoles.includes(role)) {
    return createResponse(false, 'Invalid role. Must be admin, read_edit, or read_only');
  }
  
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(AUTHORIZED_USERS_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        sheet.getRange(i + 1, 4).setValue(role);
        return createResponse(true, 'User role updated successfully');
      }
    }
    
    return createResponse(false, 'User not found');
  } catch (error) {
    console.error('Error updating user role:', error);
    return createResponse(false, error.message);
  }
}

function handleDeleteAuthorizedNumber(id) {
  if (!id) {
    return createResponse(false, 'ID is required');
  }
  
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(AUTHORIZED_USERS_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        // Don't allow deletion of admin users
        if (data[i][3] === 'admin') {
          return createResponse(false, 'Cannot delete admin users');
        }
        sheet.deleteRow(i + 1);
        return createResponse(true, 'Authorized number deleted successfully');
      }
    }
    
    return createResponse(false, 'Authorized number not found');
  } catch (error) {
    console.error('Error deleting authorized number:', error);
    return createResponse(false, error.message);
  }
}

function handleUpdateNumberStatus(id, status) {
  if (!id || !status) {
    return createResponse(false, 'ID and status are required');
  }
  
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(AUTHORIZED_USERS_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        sheet.getRange(i + 1, 5).setValue(status);
        return createResponse(true, 'Status updated successfully');
      }
    }
    
    return createResponse(false, 'Authorized number not found');
  } catch (error) {
    console.error('Error updating status:', error);
    return createResponse(false, error.message);
  }
}

// Helper functions
function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message
  };
  
  if (data) {
    Object.assign(response, data);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// Setup functions
function setupSpreadsheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Setup Authorized Users sheet
    let authSheet = spreadsheet.getSheetByName(AUTHORIZED_USERS_SHEET_NAME);
    if (!authSheet) {
      authSheet = spreadsheet.insertSheet(AUTHORIZED_USERS_SHEET_NAME);
      authSheet.getRange(1, 1, 1, 6).setValues([['ID', 'Mobile', 'UserName', 'Role', 'Status', 'AddedDate']]);
      
      // Add default admin user (replace with your mobile number)
      const adminId = new Date().getTime();
      authSheet.appendRow([adminId, '8392680202', 'Default Admin', 'admin', 'active', new Date().toISOString().split('T')[0]]);
    }
    
    // Setup current year donations sheet
    const currentYear = new Date().getFullYear();
    const currentYearSheet = getYearSheet(currentYear);
    
    return createResponse(true, 'Spreadsheet setup completed');
  } catch (error) {
    console.error('Error setting up spreadsheet:', error);
    return createResponse(false, error.message);
  }
}

// Test function to verify setup
function testSetup() {
  console.log('Testing authentication...');
  const authResult = handleAuthentication('8392680202');
  console.log('Auth result:', authResult);
  
  console.log('Testing get authorized numbers...');
  const numbersResult = handleGetAuthorizedNumbers();
  console.log('Numbers result:', numbersResult);
  
  return 'Setup test completed. Check logs for results.';
}

// Setup function - run this once to initialize the sheets
function setupInitial() {
  initializeSheets();
  console.log('Sheets initialized successfully');
}

// Initialize sheets function
function initializeSheets() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Setup Authorized Users sheet
    let authSheet = spreadsheet.getSheetByName(AUTHORIZED_USERS_SHEET_NAME);
    if (!authSheet) {
      authSheet = spreadsheet.insertSheet(AUTHORIZED_USERS_SHEET_NAME);
      authSheet.getRange(1, 1, 1, 6).setValues([['ID', 'Mobile', 'UserName', 'Role', 'Status', 'AddedDate']]);
      authSheet.getRange(1, 1, 1, 6).setFontWeight('bold');
      
      // Add default admin user
      const adminId = new Date().getTime();
      authSheet.appendRow([adminId, '8392680202', 'Default Admin', 'admin', 'active', new Date().toISOString().split('T')[0]]);
    }
    
    // Setup current year donations sheet
    const currentYear = new Date().getFullYear();
    getYearSheet(currentYear);
    
    console.log('Sheets initialized successfully');
  } catch (error) {
    console.error('Error initializing sheets:', error);
    throw error;
  }
}
