# Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: **super-mall**
4. Disable Google Analytics (optional)
5. Click "Create Project"

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Click "Save"

## Step 3: Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create Database"
3. Choose **Start in test mode** (we'll add security rules later)
4. Select location closest to you
5. Click "Enable"

## Step 4: Enable Storage

1. Go to **Storage**
2. Click "Get Started"
3. Start in **test mode**
4. Click "Done"

## Step 5: Get Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click **Web** icon (</>)
4. Register app name: **super-mall-web**
5. Copy the `firebaseConfig` object

## Step 6: Update Configuration

1. Open `src/firebase.js`
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Step 7: Create Initial Admin User

After running the app for the first time:

1. Register a new user
2. Go to Firebase Console > **Firestore Database**
3. Find the user document in the `users` collection
4. Edit the document and change `role` to `"admin"`

## Firestore Security Rules (Production)

Replace test mode rules with these in **Firestore Database > Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Shops collection
    match /shops/{shopId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                      (request.resource.data.ownerId == request.auth.uid ||
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow update, delete: if request.auth != null &&
                              (resource.data.ownerId == request.auth.uid ||
                               get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Offers collection
    match /offers/{offerId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Categories collection
    match /categories/{categoryId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Floors collection
    match /floors/{floorId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Logs collection
    match /logs/{logId} {
      allow read: if request.auth != null &&
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if request.auth != null;
    }
  }
}
```

## Storage Security Rules

Go to **Storage > Rules** and add:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## Ready to Run!

After completing these steps, run:
```bash
npm run dev
```
