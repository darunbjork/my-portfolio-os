# Backend Authentication Updates: Forgot & Reset Password

This document outlines the recent backend changes related to the "Forgot Password" and "Reset Password" functionality. These updates provide the necessary API endpoints and logic for users to securely reset their passwords.

## 1. New API Endpoints

### 1.1. Request Password Reset Link

*   **Purpose:** Initiates the password reset process by sending a reset link to the user's registered email.
*   **Method:** `POST`
*   **Path:** `/api/v1/auth/forgotpassword`
*   **Request Body:**
    ```json
    {
        "email": "user@example.com"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
        "success": true,
        "data": "Email sent"
    }
    ```
*   **Error Responses:** Standard error format (e.g., 400 for invalid email, 404 if user not found, 500 for email sending failure).

### 1.2. Reset Password with Token

*   **Purpose:** Allows a user to set a new password using a valid reset token received via email.
*   **Method:** `PUT`
*   **Path:** `/api/v1/auth/resetpassword/:resettoken` (where `:resettoken` is the unique token from the email link)
*   **Request Body:**
    ```json
    {
        "password": "newStrongPassword123"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
        "status": "success",
        "token": "jwt_token_here",
        "user": {
            "id": "user_id",
            "email": "user@example.com",
            "role": "user_role"
        }
    }
    ```
*   **Error Responses:** Standard error format (e.g., 400 for invalid/expired token).

## 2. Backend Code Changes

### 2.1. `src/models/User.js`

*   **New Fields:**
    *   `resetPasswordToken`: `String` - Stores the hashed password reset token.
    *   `resetPasswordExpire`: `Date` - Stores the expiration timestamp for the token (e.g., 10 minutes from generation).
*   **New Method:**
    *   `UserSchema.methods.getResetPasswordToken()`: A new instance method responsible for generating a random token, hashing it, setting its expiration, and returning the unhashed token for email delivery.
*   **Dependency:** `crypto` module added for token generation and hashing.

### 2.2. `src/controllers/authController.js`

*   **`forgotPassword` Function:**
    *   Handles the `POST /api/v1/auth/forgotpassword` request.
    *   Validates email, finds user, generates token using `user.getResetPasswordToken()`.
    *   Saves the user with the new token and expiration.
    *   Constructs the password reset URL.
    *   (Currently commented out for local testing) Calls `sendEmail` utility to send the reset link.
*   **`resetPassword` Function:**
    *   Handles the `PUT /api/v1/auth/resetpassword/:resettoken` request.
    *   Hashes the incoming token and finds the user by the hashed token and checks for expiration.
    *   If valid, updates the user's password, clears the `resetPasswordToken` and `resetPasswordExpire` fields.
    *   Returns a new JWT upon successful password reset.
*   **Dependencies:** `ErrorResponse` (from `../utils/errorResponse`), `crypto`, and `sendEmail` (from `../utils/sendEmail`) are now imported and used.

### 2.3. `src/api/auth.js`

*   **New Routes:**
    *   `router.post('/forgotpassword', forgotPassword);`
    *   `router.put('/resetpassword/:resettoken', resetPassword);`
*   **Import Update:** `forgotPassword` and `resetPassword` functions are now destructured from `authController`.
*   **Correction:** The `protect` middleware was re-added to `router.put('/updatepassword', protect, updatePassword);` to ensure proper authentication for password updates.

### 2.4. `src/utils/sendEmail.js`

*   **New File:** A dedicated utility for sending emails using `nodemailer`.
*   **Configuration:** Uses environment variables for SMTP host, port, authentication, and sender details.

## 3. Environment Variables

The following environment variables are now required for the email sending functionality:

*   `SENDGRID_API_KEY`: Your SendGrid API Key (starts with `SG.`).
*   `FROM_EMAIL`: The email address that will appear as the sender. This *must* be a verified sender identity in your SendGrid account.

---
