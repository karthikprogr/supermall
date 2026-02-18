# 🚀 Quick Start Guide

## Prerequisites Checklist
- ✅ Node.js installed (v16+)
- ✅ npm installed
- ⚠️ Firebase account needed (free)

## 🔥 IMPORTANT: Firebase Setup Required

**The app will NOT work without Firebase configuration!**

Before running the app, you MUST:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create Firestore Database
5. Enable Storage
6. Copy your config to `src/firebase.js`

📖 **See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed instructions**

---

## ⚡ Quick Start (After Firebase Setup)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
Edit `src/firebase.js` and replace with your config:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Open Browser
Navigate to: `http://localhost:5173/`

---

## 🎯 First Time Setup

### Create Admin Account
1. Click "Register" on the homepage
2. Create an account with any email
3. Go to Firebase Console → Firestore
4. Find your user in the `users` collection
5. Edit the document and change `role` to `"admin"`
6. Logout and login again

### Add Sample Data (Optional)
As admin:
1. Go to Admin Dashboard
2. Add categories: Electronics, Fashion, Food, Books
3. Add floors: Ground Floor, First Floor, Second Floor

---

## 📁 Project Structure Overview

```
src/
├── components/        # Reusable UI components
├── contexts/          # React Context (Auth)
├── pages/            # All page components
│   ├── admin/        # Admin pages
│   ├── merchant/     # Merchant pages
│   └── user/         # User pages
├── utils/            # Helper functions
└── firebase.js       # ⚠️ CONFIGURE THIS FIRST
```

---

## 🎭 User Roles & Access

| Role | Email Pattern | Capabilities |
|------|--------------|--------------|
| **Admin** | admin@... | Manage system, categories, floors |
| **Merchant** | merchant@... | Create shops, add products, offers |
| **User** | user@... | Browse, compare, view offers |

---

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## ❗ Common Issues & Solutions

### Issue: "Firebase not configured" error
**Solution:** Update `src/firebase.js` with your actual Firebase config

### Issue: Can't login
**Solution:** Make sure Firebase Authentication is enabled in Firebase Console

### Issue: Images not uploading
**Solution:** Enable Firebase Storage in Firebase Console

### Issue: Database errors
**Solution:** 
1. Enable Firestore in Firebase Console
2. Update security rules (see FIREBASE_SETUP.md)

---

## 🎨 Features to Test

### As Admin:
- ✅ Create categories
- ✅ Create floors
- ✅ View all shops
- ✅ System statistics

### As Merchant:
- ✅ Create shop
- ✅ Add products with images
- ✅ Create offers
- ✅ Manage inventory

### As User:
- ✅ Browse shops
- ✅ Filter products
- ✅ Compare products
- ✅ View offers

---

## 📚 Documentation Files

- `README.md` - Complete project documentation
- `FIREBASE_SETUP.md` - Detailed Firebase setup guide
- `QUICKSTART.md` - This file

---

## 🆘 Need Help?

1. Check [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for Firebase issues
2. Check browser console for errors
3. Ensure Firebase config is correct
4. Verify all Firebase services are enabled

---

## ✨ Next Steps

1. ✅ Complete Firebase setup
2. ✅ Run the app
3. ✅ Create admin account
4. ✅ Add sample data
5. 🎉 Start exploring!

---

**Ready to build? Follow the Firebase setup first!**
