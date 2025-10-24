# NotaryChain Quick Reference Guide

## Quick Links
- 🔐 [Login Page](http://localhost:5173/login)
- 📝 [Notary/Client Signup](http://localhost:5173/signup)
- 👑 [Admin Signup](http://localhost:5173/admin/signup)
- 📊 [Dashboard](http://localhost:5173/dashboard)

---

## User Roles Overview

### 👤 Client
**Purpose**: Receive and manage notarized documents

**Registration**: `/signup` → Select "Client"

**Capabilities**:
- ✅ View received documents
- ✅ Download certified PDFs
- ✅ Track document status
- ✅ Manage profile

---

### 🛡️ Notary
**Purpose**: Upload, certify, and deliver documents

**Registration**: `/signup` → Select "Notary" → Enter credentials

**Required Information**:
- License Number
- Licensed State
- Service Zones (e.g., "Manhattan, Brooklyn")
- Specialization (Real Estate, Legal, Corporate, Estate Planning, General)
- Max Daily Workload (1-50 documents/day)

**Capabilities**:
- ✅ Upload & certify PDF documents
- ✅ Manage clients
- ✅ Configure service zones
- ✅ Set daily capacity
- ✅ Track deliveries
- ✅ View performance metrics

---

### ⚙️ Administrator
**Purpose**: Manage platform and users

**Registration**: `/admin/signup` (Separate admin path)

**Capabilities**:
- ✅ Full system access
- ✅ User management (all roles)
- ✅ Notary verification
- ✅ System configuration
- ✅ Analytics & reporting
- ✅ Audit logs

**Security Note**: Enable 2FA immediately after registration

---

## Common Tasks

### 🔑 Login
1. Go to `/login`
2. Enter email and password
3. Click "Sign In"
4. Redirected to dashboard

**Alternative**: Use Google or Microsoft SSO

---

### 📤 Upload Document (Notaries Only)
1. Dashboard → **Documents**
2. Click "Upload & Certify PDF"
3. Drag-and-drop PDF or click to browse
4. Check certification box
5. Select document type
6. Add notes (optional)
7. Click "Upload & Certify Document"

**Requirements**:
- ✅ PDF format only
- ✅ Max 10MB file size
- ✅ Must certify authenticity

---

### 📥 Download Document (All Users)
1. Dashboard → **Documents**
2. Find document in list
3. Click "Download" button
4. PDF saves to device

---

### 👥 Manage Clients (Notaries)
1. Dashboard → **Clients**
2. View all client relationships
3. Click "Add Client" to register new
4. View client details and history

---

### 🔧 Update Profile
1. Click avatar (top-right)
2. Select "Profile"
3. Update information:
   - Personal details
   - Notary credentials (notaries only)
   - Service zones
   - Daily workload
4. Save changes

---

### 🔐 Change Password
1. Click avatar → **Settings**
2. Navigate to "Security"
3. Enter current password
4. Enter new password (min 8 chars)
5. Confirm new password
6. Save

---

## Dashboard Navigation

### Sidebar Menu
| Icon | Section | Description |
|------|---------|-------------|
| 📊 | Dashboard | Overview & statistics |
| 📄 | Documents | Upload/manage PDFs |
| 👥 | Clients | Client management (Notary/Admin) |
| 🛡️ | Notaries | Notary directory |
| 📅 | Calendar | Scheduling (Coming Soon) |
| ⚙️ | Settings | Configuration |
| 👤 | Profile | User account |

### Top Bar
- 🔍 **Search**: Find documents, users
- 💬 **Messages**: Communications
- 🔔 **Notifications**: System alerts
- 👤 **User Menu**: Profile, settings, logout

---

## Document Status Codes

| Status | Icon | Meaning |
|--------|------|---------|
| Pending | 🟡 | Awaiting review |
| Verified | 🟢 | Approved and ready |
| Rejected | 🔴 | Not approved |
| Archived | 🗄️ | Moved to archive |

---

## File Requirements

### PDF Upload Specifications
- **Format**: PDF only
- **Max Size**: 10MB (standard), 100MB (premium)
- **Validation**: Automatic integrity check
- **Encryption**: AES-256 at rest
- **Transmission**: TLS/SSL

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` | Focus search |
| `Esc` | Close modal |
| `Ctrl/Cmd + S` | Save (in forms) |
| `Ctrl/Cmd + U` | Upload document |

---

## Error Messages

### Common Errors & Solutions

#### "Invalid file type"
❌ **Problem**: File is not a PDF
✅ **Solution**: Convert to PDF format before uploading

#### "File too large"
❌ **Problem**: File exceeds 10MB
✅ **Solution**: Compress PDF or upgrade to premium

#### "Authentication failed"
❌ **Problem**: Invalid credentials
✅ **Solution**: Use "Forgot Password" to reset

#### "Certification required"
❌ **Problem**: Certification checkbox not checked
✅ **Solution**: Check the certification box before uploading

---

## API Endpoints (For Developers)

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - User login
POST   /api/auth/logout      - User logout
GET    /api/auth/verify      - Verify token
```

### Documents
```
POST   /api/documents/upload - Upload PDF
GET    /api/documents        - List documents
GET    /api/documents/:id    - Get document details
PUT    /api/documents/:id    - Update document
DELETE /api/documents/:id    - Delete document
```

### Users
```
GET    /api/notaries         - List notaries
GET    /api/clients          - List clients
GET    /api/users/:id        - Get user profile
PUT    /api/users/:id        - Update user
```

### Statistics
```
GET    /api/stats/dashboard  - Dashboard metrics
```

**Authentication**: Bearer token in Authorization header
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Configuration Variables

### Environment Variables (.env)
```bash
# App
VITE_APP_NAME=NotaryChain
VITE_APP_URL=http://localhost:5173

# API
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# Files
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=.pdf,application/pdf

# Features
VITE_ENABLE_SOCIAL_LOGIN=false
VITE_ENABLE_MAP_INTEGRATION=false

# OAuth (Optional)
VITE_GOOGLE_MAPS_API_KEY=your-key
VITE_GOOGLE_CLIENT_ID=your-client-id
VITE_MICROSOFT_CLIENT_ID=your-client-id
```

---

## NPM Scripts

### Development
```bash
npm run dev          # Start development server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Installation
```bash
npm install          # Install dependencies
npm ci               # Clean install
npm cache clean -f   # Clear npm cache
```

---

## Browser Support

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| IE 11 | - | ❌ Not Supported |

---

## Troubleshooting Checklist

### Can't Login?
- [ ] Verify email is correct
- [ ] Check CAPS LOCK is off
- [ ] Try password reset
- [ ] Clear browser cache
- [ ] Try different browser

### Upload Not Working?
- [ ] Check file is PDF format
- [ ] Verify file size < 10MB
- [ ] Check internet connection
- [ ] Try different browser
- [ ] Disable browser extensions

### Page Won't Load?
- [ ] Check internet connection
- [ ] Clear browser cache
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Check console for errors
- [ ] Try incognito/private mode

---

## Security Checklist

### For All Users
- [ ] Use strong, unique password (8+ chars)
- [ ] Never share credentials
- [ ] Log out on shared devices
- [ ] Review account activity regularly
- [ ] Keep browser updated

### For Notaries
- [ ] Verify documents before certifying
- [ ] Keep license information current
- [ ] Update service zones as needed
- [ ] Review client requests carefully

### For Administrators
- [ ] Enable two-factor authentication
- [ ] Review security logs daily
- [ ] Verify notary credentials thoroughly
- [ ] Monitor system activity
- [ ] Keep audit trail

---

## Support Resources

### Documentation
- 📖 [Full User Guide](./USER_GUIDE.md)
- 💻 [Technical README](./README.md)
- 🚀 [This Quick Reference](./QUICK_REFERENCE.md)

### Getting Help
- 📧 Email: support@notarychain.com
- 🐛 Report Bug: Open GitHub issue
- 💡 Feature Request: feedback@notarychain.com
- 📞 Phone: 1-800-NOTARY-1

### Online Resources
- Help Center (in-app)
- Video Tutorials (Dashboard → Help)
- FAQ Section
- Community Forum (when available)

---

## Useful Commands

### Development
```bash
# Clone repository
git clone <repo-url>
cd notaries-client

# Setup
nvm use 23
npm install

# Run
npm run dev
```

### Production
```bash
# Build
npm run build

# Test build locally
npm run preview

# Deploy (example: Vercel)
vercel --prod
```

### Troubleshooting
```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 23.x

# Clear npm cache
npm cache clean --force
```

---

## Tips & Tricks

### For Notaries
💡 **Tip**: Set realistic daily workload to avoid burnout
💡 **Tip**: Keep service zones updated for accurate matching
💡 **Tip**: Use descriptive filenames for easy document tracking
💡 **Tip**: Add certification notes for client clarity

### For Clients
💡 **Tip**: Download important documents immediately
💡 **Tip**: Keep local backups of certified files
💡 **Tip**: Check document status regularly
💡 **Tip**: Provide accurate contact information

### For Admins
💡 **Tip**: Regular database backups are essential
💡 **Tip**: Monitor system logs for suspicious activity
💡 **Tip**: Verify notary credentials thoroughly
💡 **Tip**: Keep user documentation updated

---

## Glossary

**Certification**: Official verification by notary that document is authentic

**Service Zone**: Geographic area where notary provides services

**Daily Workload**: Maximum documents a notary can process per day

**True Copy**: Exact replica of original document, certified by notary

**Validation**: Automated system check for document integrity

**JWT**: JSON Web Token used for authentication

**Protected Route**: Page requiring user authentication

**KPI**: Key Performance Indicator (dashboard metrics)

---

## Version Information

**Current Version**: 1.0.0 (MVP)
**Last Updated**: October 24, 2025
**Node Version**: 23.x
**React Version**: 18.3.1

---

## Related Documentation

1. **[USER_GUIDE.md](./USER_GUIDE.md)** - Comprehensive user documentation
2. **[README.md](./README.md)** - Technical documentation and setup
3. **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - This document

---

*For detailed information, always refer to the complete User Guide and README.*

© 2024 NotaryChain. All rights reserved.

