# Email Verification with OTP Implementation

This implementation adds email verification with OTP (One-Time Password) for both user registration and password reset functionality.

## Features Added

### 1. User Registration with Email Verification
- Users register with name, email, and password
- An OTP is sent to their email address for verification
- Users must verify their email before they can log in
- Unverified users cannot access the application

### 2. Password Reset with OTP
- Users can request a password reset by entering their email
- An OTP is sent to their email address
- Users must enter the OTP to verify their identity
- After verification, they can set a new password

### 3. OTP Management
- OTPs are 6-digit random numbers
- OTPs expire after 10 minutes
- Users can resend OTPs with a cooldown period
- Failed verification attempts provide clear error messages

## Backend Changes

### 1. Updated User Model (`backend/models/User.js`)
Added new fields:
```javascript
isEmailVerified: { type: Boolean, default: false }
emailVerificationOTP: { type: String, select: false }
emailVerificationOTPExpires: { type: Date, select: false }
passwordResetOTP: { type: String, select: false }
passwordResetOTPExpires: { type: Date, select: false }
```

Added new methods:
- `generateEmailVerificationOTP()`
- `generatePasswordResetOTP()`
- `verifyEmailOTP(otp)`
- `verifyPasswordResetOTP(otp)`
- `clearEmailVerificationOTP()`
- `clearPasswordResetOTP()`

### 2. Email Service (`backend/services/emailService.js`)
A new service that handles sending OTP emails using Nodemailer:
- `sendEmailVerificationOTP(email, otp, name)`
- `sendPasswordResetOTP(email, otp, name)`

Features beautiful HTML email templates with:
- Company branding
- Clear OTP display
- Security warnings
- Responsive design

### 3. Updated Authentication Routes (`backend/routes/auth.js`)

#### New Routes:
- `POST /api/auth/verify-email` - Verify email with OTP
- `POST /api/auth/resend-verification-otp` - Resend verification OTP
- `POST /api/auth/verify-reset-otp` - Verify password reset OTP
- `POST /api/auth/reset-password` - Reset password with OTP

#### Updated Routes:
- `POST /api/auth/register` - Now sends OTP instead of immediate registration
- `POST /api/auth/login` - Now checks for email verification
- `POST /api/auth/forgot-password` - Now sends OTP instead of reset link

### 4. Dependencies Added
```bash
npm install nodemailer
```

## Frontend Changes

### 1. Updated AuthContext (`src/context/AuthContext.tsx`)
Added new functions:
- `verifyEmail(email, otp)`
- `resendVerificationOTP(email)`
- `forgotPassword(email)`
- `verifyResetOTP(email, otp)`
- `resetPassword(email, otp, newPassword)`

### 2. OTP Input Component (`src/components/forms/OTPInput.tsx`)
A reusable component for OTP input:
- 6-digit input fields
- Auto-focus and auto-advance
- Paste support
- Resend functionality with cooldown
- Keyboard navigation
- Loading states and error handling

### 3. Updated RegisterPage (`src/pages/RegisterPage.tsx`)
- Two-step registration process
- OTP verification step after initial registration
- Resend OTP functionality

### 4. New ForgotPasswordPage (`src/pages/ForgotPasswordPage.tsx`)
- Three-step password reset process:
  1. Enter email address
  2. Verify OTP
  3. Set new password

### 5. Updated LoginPage (`src/pages/LoginPage.tsx`)
- Handles email verification requirements
- Shows OTP verification if user needs to verify email
- Link to forgot password page
- Success message display from password reset

## Email Configuration

### Environment Variables
Add these to your `backend/.env` file:

```bash
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@bulkbuy.com
```

### For Development
Use Ethereal Email for testing:
```bash
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=ethereal.user@ethereal.email
SMTP_PASS=ethereal.pass
```

### For Production
Configure with your email service provider:
- **Gmail**: Use app passwords, not account password
- **SendGrid**: Use API key authentication
- **AWS SES**: Configure with AWS credentials
- **Mailgun**: Use domain and API key

## Security Features

1. **OTP Expiration**: OTPs expire after 10 minutes
2. **Rate Limiting**: Prevent spam by implementing cooldown periods
3. **Secure Storage**: OTPs are stored securely and cleared after use
4. **Email Validation**: Proper email format validation
5. **Password Requirements**: Minimum 6 characters
6. **Error Handling**: Clear error messages without exposing sensitive information

## User Experience

### Registration Flow:
1. User fills registration form
2. User receives OTP email
3. User enters OTP to verify email
4. User is logged in and redirected to dashboard

### Password Reset Flow:
1. User clicks "Forgot Password" on login page
2. User enters email address
3. User receives OTP email
4. User enters OTP to verify identity
5. User sets new password
6. User is redirected to login with success message

### Login Flow:
1. User enters email and password
2. If email not verified, user is shown OTP verification
3. User verifies email and is logged in
4. If credentials are wrong, user sees error message

## Testing

To test the email functionality:

1. **Development**: Use Ethereal Email to capture test emails
2. **Staging**: Use a test email account
3. **Production**: Use real email service

## Error Handling

The implementation includes comprehensive error handling for:
- Invalid OTP codes
- Expired OTPs
- Network failures
- Email service failures
- Missing user accounts
- Already verified emails

## Future Enhancements

1. **Email Templates**: More sophisticated email designs
2. **SMS OTP**: Alternative verification method
3. **Rate Limiting**: More sophisticated anti-spam measures
4. **Analytics**: Track verification success rates
5. **Internationalization**: Support multiple languages
6. **Social Login**: Alternative registration methods

## Usage Examples

### Register with Email Verification
```typescript
// User registers
const result = await register(name, email, password);
if (result.requiresVerification) {
  // Show OTP input
  await verifyEmail(email, otp);
}
```

### Password Reset
```typescript
// Request password reset
await forgotPassword(email);

// Verify OTP
const { resetToken } = await verifyResetOTP(email, otp);

// Reset password
await resetPassword(email, resetToken, newPassword);
```

This implementation provides a secure, user-friendly email verification system that enhances the security of your group buying platform while maintaining a smooth user experience.
