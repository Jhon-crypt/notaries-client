# Demo Credentials - NotaryChain

**⚠️ IMPORTANT: This is for DEMO/DEVELOPMENT purposes only!**

In production, authentication will be handled by a secure backend with proper password hashing and JWT tokens.

---

## How Demo Login Works

The current MVP uses **email pattern matching** to determine user roles:

- If email contains `"admin"` → Logs in as **Administrator**
- If email contains `"notary"` → Logs in as **Notary**
- If email contains `"client"` → Logs in as **Client**
- Any other email → Defaults to **Client**

**Password**: Any password works in demo mode (no validation)

---

## Demo Credentials

### 👑 Administrator

**Email**: `admin@notarychain.com` (or any email with "admin")  
**Password**: `password` (or anything)  
**Access**:
- Full system access
- Verify new notaries
- Manage all users
- View all documents
- System settings

---

### 🛡️ Notary

**Email**: `notary@example.com` (or any email with "notary")  
**Password**: `password` (or anything)  
**Access**:
- Upload & certify documents
- Manage clients
- Define service zones
- View own performance metrics
- Update profile

**Example Emails**:
- `notary@notarychain.com`
- `john.notary@example.com`
- `notary.services@mail.com`

---

### 👤 Client

**Email**: `client@example.com` (or any email with "client")  
**Password**: `password` (or anything)  
**Access**:
- View received documents
- Download certified PDFs
- Track document status
- Manage profile

**Example Emails**:
- `client@notarychain.com`
- `jane.client@example.com`
- `myclient@mail.com`

**Default**: Any other email will log in as Client

---

## Quick Test Examples

### Test as Administrator
```
Email: admin@test.com
Password: anything
→ Logs in as: Admin User
```

### Test as Notary
```
Email: notary@test.com
Password: anything
→ Logs in as: Carlic Bolomboy (Notary)
```

### Test as Client
```
Email: client@test.com
Password: anything
→ Logs in as: Client User
```

### Test with Random Email
```
Email: john@example.com
Password: anything
→ Logs in as: Demo User (Client role)
```

---

## Registration vs Login

### During Registration (`/signup` or `/admin/signup`)
- Users provide complete information
- Form data is **collected but not validated** (no backend yet)
- After registration, users are logged in with their selected role

### During Login (`/login`)
- Email pattern determines role in demo mode
- In production, role will come from backend authentication

---

## For Production Deployment

This demo authentication **MUST be replaced** with:

1. **Backend API Authentication**
   ```javascript
   POST /api/auth/login
   {
     "email": "user@example.com",
     "password": "securePassword123"
   }
   
   Response:
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": 123,
       "email": "user@example.com",
       "role": "notary",
       "name": "John Doe"
     }
   }
   ```

2. **Password Security**
   - Hashing with bcrypt/argon2
   - Minimum password requirements
   - Password reset functionality
   - Account lockout after failed attempts

3. **Token Management**
   - JWT tokens with expiration
   - Refresh token mechanism
   - Secure token storage
   - Token revocation on logout

4. **Email Verification**
   - Verify email on registration
   - Send confirmation link
   - Require verification before login

5. **Two-Factor Authentication** (Admin accounts)
   - TOTP-based 2FA
   - SMS verification option
   - Backup codes

---

## Security Notes

### Current Demo Limitations
- ❌ No password validation
- ❌ No user database
- ❌ No session management
- ❌ No token expiration
- ❌ No rate limiting
- ❌ No brute force protection
- ❌ Data stored in localStorage (insecure)

### What Users Should Know
- **Never use demo credentials in production**
- **All data is local** (cleared on browser cache clear)
- **No real security** - This is for UI/UX testing only

---

## Testing Different User Experiences

### Test Admin Features
1. Login with `admin@test.com`
2. Navigate to "Notaries" → See "Verify New Notary" button
3. Access all management features

### Test Notary Features
1. Login with `notary@test.com`
2. Navigate to "Documents" → Upload & certify PDFs
3. View "Clients" section
4. Define service zones in profile

### Test Client Features
1. Login with `client@test.com`
2. View received documents
3. Download certified files
4. Limited access (no upload capability)

---

## Troubleshooting

### Can't Login?
- **Any email works** - just make sure it has the right pattern
- **Any password works** - demo doesn't validate
- Clear browser cache/localStorage if issues persist

### Logged in as Wrong Role?
- Check your email contains correct keyword:
  - `admin` for Administrator
  - `notary` for Notary  
  - `client` for Client

### Want to Switch Roles?
1. Logout
2. Login with different email pattern
3. Or clear localStorage and re-login

---

## Code Location

The demo authentication logic is in:
```
/src/pages/auth/Login.jsx
Lines 12-41 (handleSubmit function)
```

To modify role detection, edit:
```javascript
if (formData.email.includes('admin')) {
  userRole = 'admin';
  // ...
}
```

---

**Last Updated**: October 29, 2025  
**Version**: 1.1 (MVP Demo)

⚠️ **Remember**: Replace with real authentication before production deployment!

