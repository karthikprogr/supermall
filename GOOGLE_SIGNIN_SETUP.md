# Google Sign-In Setup Guide

## Step 1: Enable Google Authentication in Firebase

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: **super-mall-fafa2**
3. Click **"Authentication"** in the left sidebar
4. Click **"Get Started"** (if first time) or **"Sign-in method"** tab
5. Find **"Google"** in the providers list
6. Click on **"Google"**
7. Toggle **"Enable"** switch to ON
8. Select a **"Project support email"** (your email)
9. Click **"Save"**

## Step 2: Test Google Sign-In

1. Open your app: http://localhost:5173/
2. Click **"Login"** or **"Register"**
3. Click **"Continue with Google"** button
4. Sign in with your Google account
5. **Select your role** in the popup:
   - **Customer** (👤) - Browse shops and products
   - **Merchant** (🏪) - Manage shops and products
   - **Admin** (⚙️) - Manage entire mall

## Features:

- ✅ **New Users**: Choose role during first sign-in
- ✅ **Existing Users**: Automatically logged in with existing role
- ✅ **Role Options**: Customer, Merchant, or Admin
- ✅ **No Password**: One-click authentication with Google

## How It Works:

1. User clicks "Continue with Google"
2. Google authentication popup appears
3. **If new user**: Role selection modal shows
4. **If existing user**: Automatically redirected to dashboard
5. User profile created in Firestore with chosen role

## Security:

- Firebase handles all authentication
- User data stored securely in Firestore
- Role-based access control enforced
- All actions logged in system

---

**That's it!** Google Sign-In is now fully integrated with role selection.
