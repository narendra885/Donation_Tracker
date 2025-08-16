# 🤝 Donation Tracker - Free Web Application

🎯 **Live Demo**: [https://narendra885.github.io/Donation_Tracker](https://narendra885.github.io/Donation_Tracker)

A completely free donation tracking web application that can be hosted on GitHub Pages with Google Sheets as the database.

## ✨ Features

- **Mobile Number Authentication**: Secure access control based on admin-authorized mobile numbers
- **Real-time Dashboard**: Live updates of donation data with statistics
- **Donation Management**: Track donor names, amounts given, and committed amounts
- **Admin Panel**: Manage authorized users and system configuration
- **Google Sheets Integration**: All data stored in Google Sheets for easy access and backup
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Export Functionality**: Export donation data to CSV format
- **Completely Free**: Uses only free services (GitHub Pages, Google Sheets, Google Apps Script)

## 🎯 Live Demo

- **Username**: Use mobile number `+1234567890` (default admin)
- **Dashboard**: View donations and statistics
- **Admin Panel**: Manage authorized users

## 🚀 Quick Setup

### 1. Google Sheets Setup

1. Create a new Google Sheet
2. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
3. Note down this ID for later use

### 2. Google Apps Script Setup

1. Go to [Google Apps Script](https://script.google.com/)
2. Create a new project
3. Replace the default code with the content from `google-apps-script/Code.gs`
4. Update the `SPREADSHEET_ID` variable with your Google Sheet ID
5. Save the project
6. Deploy as Web App:
   - Click "Deploy" → "New Deployment"
   - Choose "Web app" as type
   - Set execute as "Me"
   - Set access to "Anyone"
   - Click "Deploy"
7. Copy the Web App URL

### 3. Frontend Configuration

1. Open `js/auth.js`, `js/dashboard.js`, and `js/admin.js`
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with your Web App URL
3. Save all files

### 4. GitHub Pages Deployment

1. Create a new GitHub repository
2. Upload all project files to the repository
3. Go to repository Settings → Pages
4. Select "Deploy from a branch" 
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"
7. Your site will be available at `https://yourusername.github.io/repository-name`

## 📱 Usage

### For Users
1. Visit your GitHub Pages URL
2. Enter your authorized mobile number
3. Access the dashboard to view and manage donations

### For Admins
1. Login with admin mobile number
2. Click "Admin" button to access admin panel
3. Add/remove authorized mobile numbers
4. Export donation data
5. Configure system settings

## 🔧 Configuration

### Default Admin Access
The default admin mobile number is `+1234567890`. You can change this by:
1. Modifying the Google Apps Script
2. Or adding your number through the admin panel after initial setup

### Mobile Number Format
- Must include country code (e.g., `+1234567890`)
- Should be 10-15 digits after the country code

## 📊 Data Structure

### Donations Sheet
- ID, Donor Name, Donor Phone, Amount Given, Amount Committed, Date, Notes, Added By

### Authorized Users Sheet  
- ID, Mobile, User Name, Added Date, Status, Is Admin

## 🔒 Security Features

- Mobile number-based authentication
- Session management with automatic logout
- Admin-only access controls
- Data validation and sanitization

## 🆓 Free Services Used

- **GitHub Pages**: Free static site hosting
- **Google Sheets**: Free database storage
- **Google Apps Script**: Free backend serverless functions
- **No paid services required!**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support or questions:
1. Check the troubleshooting section below
2. Create an issue in the GitHub repository
3. Contact the admin through the application

## 🔧 Troubleshooting

### Common Issues

**1. "Mobile number not authorized"**
- Ensure the number is added in the admin panel
- Check the mobile number format (+countrycode + number)
- Verify the number status is "active"

**2. "Unable to load data"**
- Check your Google Apps Script Web App URL
- Ensure the Google Apps Script is deployed correctly
- Verify the Google Sheet ID is correct

**3. Google Apps Script errors**
- Run the `setupInitial()` function once in Google Apps Script
- Check that the spreadsheet ID is correct
- Ensure proper permissions are set

**4. GitHub Pages not loading**
- Check that all files are uploaded correctly
- Ensure the repository is public
- Wait a few minutes for deployment to complete

### Setup Verification

1. **Test Google Apps Script**: Open the Web App URL directly - you should see a JSON response
2. **Test Authentication**: Try logging in with `+1234567890`
3. **Test Data Flow**: Add a test donation and verify it appears in Google Sheets

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with vanilla JavaScript for maximum compatibility
- Designed for mobile-first responsive experience
- Optimized for free hosting solutions
