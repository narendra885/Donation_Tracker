<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Donation Tracker Web Application

This is a free donation tracking web application that uses GitHub Pages for hosting, Google Sheets for data storage, and Google Apps Script for backend functionality.

## Project Structure

- **Frontend**: Vanilla JavaScript, HTML, CSS for maximum compatibility with GitHub Pages
- **Backend**: Google Apps Script for serverless functions
- **Database**: Google Sheets for free data storage
- **Authentication**: Mobile number-based access control

## Key Features

- Mobile number authentication system
- Real-time donation tracking dashboard
- Admin panel for user management
- Google Sheets integration for data persistence
- Responsive design for mobile and desktop
- Export functionality for data backup

## Development Guidelines

When working on this project:

1. **Keep it Free**: Only use free services (GitHub Pages, Google Sheets, Google Apps Script)
2. **Mobile-First**: Ensure all features work well on mobile devices
3. **No Build Process**: Use vanilla JavaScript to avoid build complexity for GitHub Pages
4. **Error Handling**: Include fallback functionality for when external services are unavailable
5. **Security**: Validate all user inputs and sanitize data
6. **Performance**: Minimize API calls and implement caching where possible

## Configuration Requirements

- Google Apps Script Web App URL needs to be configured in all JavaScript files
- Google Sheets ID must be set in the Apps Script
- Default admin mobile numbers should be configured for initial access

## Testing Strategy

- Test with and without internet connectivity
- Verify mobile number validation
- Test admin vs regular user permissions
- Validate data persistence in Google Sheets
- Test responsive design on various screen sizes
