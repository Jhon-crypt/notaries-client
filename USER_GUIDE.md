# NotaryChain User Guide

## Table of Contents
1. [Overview](#overview)
2. [User Roles](#user-roles)
3. [Getting Started](#getting-started)
4. [Registration](#registration)
5. [Authentication](#authentication)
6. [Dashboard Features](#dashboard-features)
7. [Document Management](#document-management)
8. [User Management](#user-management)
9. [Settings & Profile](#settings--profile)
10. [Troubleshooting](#troubleshooting)

---

## Overview

NotaryChain is a secure document delivery platform designed for notaries, clients, and administrators to manage, authenticate, and deliver certified PDF documents with confidence.

### Key Features
- **Secure & Encrypted**: End-to-end encryption for all documents
- **PDF Validation**: Automated document verification system
- **Multi-User Access**: Support for Notaries, Clients, and Administrators
- **Real-time Tracking**: Monitor document status and delivery
- **Service Zone Management**: Geographic service area configuration for notaries
- **Workload Management**: Daily capacity planning and scheduling

---

## User Roles

NotaryChain supports three distinct user roles, each with specific permissions and capabilities:

### 1. Notary
**Purpose**: Licensed notaries who authenticate and deliver documents to clients.

**Capabilities**:
- Upload and manage certified PDF documents
- Define service zones and geographic coverage
- Set daily workload capacity (max documents per day)
- Track document deliveries
- Manage client relationships
- View personal performance metrics

**Registration Requirements**:
- Notary License Number
- Licensed State
- Service Zones
- Specialization (Real Estate, Legal Documents, Corporate, Estate Planning, General)
- Maximum Daily Workload

### 2. Client
**Purpose**: Individuals or organizations who receive notarized documents.

**Capabilities**:
- Receive and download certified documents
- View document history
- Track document status
- Communicate with notaries
- Manage personal profile

**Registration Requirements**:
- Basic personal information (Name, Email, Phone)
- Account credentials

### 3. Administrator
**Purpose**: System administrators who manage the platform and users.

**Capabilities**:
- Full system access
- User management (create, edit, deactivate accounts)
- Notary management and verification
- Client management
- System settings and configuration
- Analytics and reporting
- Monitor platform activity

**Registration Requirements**:
- Administrative credentials
- Security verification
- Two-factor authentication (recommended)

---

## Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection
- JavaScript enabled

### Accessing NotaryChain
1. Navigate to the NotaryChain application URL
2. You'll be directed to the login page
3. If you don't have an account, proceed to registration

---

## Registration

NotaryChain offers separate registration flows for different user types.

### Registering as a Notary or Client

**URL**: `/signup`

#### Step 1: Personal Information & Role Selection
1. Choose your role:
   - **Notary**: For licensed notary publics
   - **Client**: For document recipients

2. Enter personal information:
   - Full Name
   - Email Address
   - Phone Number

3. Click "Continue"

#### Step 2: Notary Information (Notaries Only)
If you selected "Notary" in Step 1, you'll need to provide:

1. **Notary License Number**: Your official notary license number
2. **Licensed State**: The state where you're licensed to practice
3. **Service Zones**: Comma-separated list of areas you serve (e.g., "Manhattan, Brooklyn")
4. **Specialization**: Select your primary area of expertise
   - Real Estate
   - Legal Documents
   - Corporate
   - Estate Planning
   - General Notary Services
5. **Maximum Daily Workload**: Set the maximum number of documents you can process per day (1-50)

**Note**: After registration, you can define your service zones on an interactive map in your profile settings.

6. Click "Continue"

**Clients skip this step** and proceed directly to Step 3.

#### Step 3: Account Security
1. Create a strong password:
   - Minimum 8 characters
   - Include numbers and special characters
   - Mix uppercase and lowercase letters

2. Confirm your password by re-entering it

3. Read and accept the Terms of Service and Privacy Policy

4. Click "Create Account"

#### Post-Registration
- For **Notaries**: Your credentials will be verified before account activation. You'll receive an email notification once approved.
- For **Clients**: Your account will be activated immediately upon registration.

### Registering as an Administrator

**URL**: `/admin/signup`

Administrator registration is separate from regular user registration to maintain security.

#### Step 1: Administrator Information
1. Enter personal information:
   - Full Name
   - Email Address (use official admin email)
   - Phone Number

2. Review the administrator responsibilities notice

3. Click "Continue"

#### Step 2: Account Security
1. Create a strong password:
   - Minimum 8 characters
   - Include numbers and special characters
   - Mix uppercase and lowercase letters

2. Confirm your password

3. Read the security notice about administrator account privileges

4. Accept the Terms of Service and Privacy Policy

5. Click "Create Admin Account"

**Security Notice**: Administrator accounts have full system access. After registration, enable two-factor authentication immediately for enhanced security.

---

## Authentication

### Logging In

**URL**: `/login`

1. Enter your registered email address
2. Enter your password
3. (Optional) Check "Remember me" to stay logged in
4. Click "Sign In"

### Alternative Login Methods
- **Google**: Sign in with your Google account
- **Microsoft**: Sign in with your Microsoft account

### Forgot Password
1. Click "Forgot password?" on the login page
2. Enter your registered email address
3. Check your email for password reset instructions
4. Follow the link to create a new password

### Session Management
- Sessions remain active for security purposes
- Automatic logout after 30 minutes of inactivity
- Always log out when using shared computers

---

## Dashboard Features

After logging in, you'll be directed to your personalized dashboard. The interface varies based on your user role.

### Notary Dashboard

#### Overview
- **Quick Stats**: Document count, active clients, pending deliveries
- **Recent Activity**: Latest document uploads and deliveries
- **Calendar**: Upcoming appointments and deadlines
- **Workload Indicator**: Current vs. maximum daily capacity

#### Navigation Menu
- **Dashboard**: Home view with statistics and recent activity
- **Documents**: Manage all your documents
- **Clients**: View and manage client relationships
- **Calendar**: Schedule and appointments (Coming Soon)
- **Settings**: Configure account and preferences
- **Profile**: Update personal and professional information

### Client Dashboard

#### Overview
- **My Documents**: Documents you've received
- **Recent Activity**: Latest document deliveries
- **Notary Contacts**: Notaries you've worked with

#### Navigation Menu
- **Dashboard**: Home view
- **Documents**: Access your documents
- **Settings**: Account preferences
- **Profile**: Personal information

### Administrator Dashboard

#### Overview
- **System Statistics**: Total users, active notaries, documents processed
- **User Management**: Quick access to user administration
- **System Health**: Platform performance metrics
- **Recent Activity**: System-wide activity log

#### Navigation Menu
- **Dashboard**: Overview and statistics
- **Documents**: System-wide document management
- **Clients**: Manage all client accounts
- **Notaries**: Manage and verify notary accounts
- **Settings**: System configuration
- **Profile**: Administrator information

---

## Document Management

### Uploading Documents (Notaries)

1. Navigate to **Dashboard** → **Documents**
2. Click "Upload New Document" or drag-and-drop PDF files
3. Select the target client from your client list
4. Add document metadata:
   - Document title
   - Category/type
   - Description (optional)
   - Priority level
5. Review the document preview
6. Click "Upload & Send"

**Supported Formats**: PDF only

**File Size Limits**: 
- Standard: Up to 25MB per file
- Premium: Up to 100MB per file

**Validation**: 
- System automatically validates PDF integrity
- Checks for corruption or tampering
- Verifies notary seal and signature (if applicable)

### Viewing Documents

1. Navigate to **Documents** page
2. Browse documents using:
   - List view: Detailed table with metadata
   - Grid view: Visual thumbnails
3. Use filters to find specific documents:
   - Date range
   - Client
   - Status (Pending, Delivered, Archived)
   - Document type
4. Click on a document to open detailed view

### Document Actions

**Available Actions**:
- **Preview**: View document without downloading
- **Download**: Save a copy to your device
- **Share**: Send to additional recipients
- **Archive**: Move to archive (notaries only)
- **Delete**: Permanently remove (admin only)
- **Track**: View delivery and read status

### Document Security

All documents are:
- Encrypted during transmission (TLS/SSL)
- Encrypted at rest (AES-256)
- Access-logged for audit trails
- Backed up automatically
- Retained per legal requirements

---

## User Management

### Managing Clients (Notaries)

1. Navigate to **Clients** page
2. View all clients you've served
3. Click "Add Client" to register a new client
4. Client information includes:
   - Contact details
   - Documents delivered
   - Last interaction date
   - Status

### Managing Users (Administrators)

1. Navigate to **Clients** or **Notaries** page
2. View comprehensive user lists
3. Actions available:
   - **View Details**: See full user profile
   - **Edit**: Modify user information
   - **Verify**: Approve notary credentials (notaries only)
   - **Deactivate**: Suspend user access
   - **Delete**: Permanently remove account

**Notary Verification Process**:
1. Review submitted credentials
2. Verify license number with state authority
3. Check service zones and specialization
4. Approve or reject application
5. User receives email notification

---

## Settings & Profile

### Profile Management

**Navigate to**: Profile section from sidebar

#### Personal Information
- Update name, email, phone
- Change profile photo
- Update contact preferences

#### Notary-Specific Settings
- License information
- Service zones (interactive map)
- Specialization
- Maximum daily workload
- Business hours
- Service rates

#### Security Settings
- Change password
- Enable two-factor authentication (2FA)
- View active sessions
- Manage connected devices
- Download account data

### Notification Preferences

Configure notifications for:
- Document uploads
- Delivery confirmations
- Client messages
- System updates
- Weekly summaries

**Delivery Methods**:
- Email notifications
- In-app notifications
- SMS alerts (optional)

### System Settings (Administrators)

- Platform configuration
- Email templates
- User role permissions
- Document retention policies
- Backup schedules
- Integration settings

---

## Troubleshooting

### Common Issues

#### Cannot Log In
**Problem**: Incorrect email or password
**Solution**: 
1. Verify email address (check for typos)
2. Use "Forgot Password" to reset
3. Clear browser cache and cookies
4. Try a different browser
5. Contact support if issue persists

#### Document Upload Failed
**Problem**: File won't upload
**Solution**:
1. Check file format (must be PDF)
2. Verify file size (under limit)
3. Ensure stable internet connection
4. Try compressing the PDF
5. Check for corrupted files

#### Service Zones Not Saving
**Problem**: Changes to service zones don't save
**Solution**:
1. Ensure proper formatting (comma-separated)
2. Check internet connection
3. Refresh page and try again
4. Clear browser cache
5. Contact support with error message

#### Two-Factor Authentication Issues
**Problem**: Cannot receive 2FA codes
**Solution**:
1. Check phone signal/internet
2. Verify phone number is correct
3. Check spam folder for email codes
4. Use backup codes if available
5. Contact administrator for assistance

### Getting Help

#### Support Resources
- **Email Support**: support@notarychain.com
- **Help Center**: Available in-app under Settings → Help
- **Video Tutorials**: Dashboard → Help → Video Guides
- **FAQ**: Common questions and answers available online

#### Reporting Bugs
1. Navigate to Settings → Help → Report Issue
2. Describe the problem in detail
3. Include steps to reproduce
4. Attach screenshots if applicable
5. Submit report

#### Feature Requests
We welcome user feedback! Submit feature requests through:
- Settings → Help → Suggest Feature
- Email: feedback@notarychain.com
- Monthly user surveys

---

## Best Practices

### For Notaries

1. **Document Management**:
   - Upload documents promptly after notarization
   - Use clear, descriptive filenames
   - Add relevant tags and categories
   - Archive completed deliveries regularly

2. **Service Zones**:
   - Keep service zones updated
   - Be realistic about coverage areas
   - Consider travel time in daily capacity

3. **Client Communication**:
   - Respond to client inquiries promptly
   - Set clear expectations for turnaround times
   - Notify clients of document uploads immediately

4. **Security**:
   - Use strong, unique passwords
   - Enable two-factor authentication
   - Log out on shared devices
   - Review account activity regularly

### For Clients

1. **Document Access**:
   - Download important documents immediately
   - Keep local backups of critical files
   - Review documents promptly

2. **Communication**:
   - Provide accurate contact information
   - Respond to notary requests quickly
   - Report any document issues immediately

### For Administrators

1. **User Management**:
   - Verify notary credentials thoroughly
   - Monitor system activity regularly
   - Address user reports promptly
   - Maintain audit logs

2. **Security**:
   - Review security logs daily
   - Update system regularly
   - Enforce strong password policies
   - Enable mandatory 2FA for admins

3. **Maintenance**:
   - Schedule regular backups
   - Test disaster recovery procedures
   - Monitor system performance
   - Keep documentation updated

---

## Privacy & Security

### Data Protection
- All personal data is encrypted
- Compliance with GDPR and CCPA
- Regular security audits
- Secure data centers with redundancy

### Data Retention
- Documents: Retained per legal requirements (typically 7 years)
- User data: Retained while account is active
- Logs: Retained for 90 days
- Deleted data is permanently removed after 30 days

### Your Rights
- Access your personal data
- Request data correction
- Request data deletion
- Export your data
- Opt-out of non-essential communications

For privacy concerns: privacy@notarychain.com

---

## Terms of Service

By using NotaryChain, you agree to:
- Provide accurate information
- Use the platform legally and ethically
- Protect your account credentials
- Respect intellectual property
- Comply with applicable laws

Full Terms of Service: [Link to Terms]

---

## Contact Information

**NotaryChain Support**
- Email: support@notarychain.com
- Phone: 1-800-NOTARY-1
- Hours: Monday-Friday, 9 AM - 6 PM EST

**Mailing Address**:
NotaryChain Inc.
123 Secure Document Way
Digital City, DC 12345

---

*Last Updated: October 24, 2025*
*Version: 1.0*

© 2024 NotaryChain. All rights reserved.

