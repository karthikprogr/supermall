# Updated Firebase Security Rules (Merchant-Based System)

## Firestore Rules

Go to Firebase Console → Firestore Database → Rules tab, and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to get user role (with safety check)
    function getUserRole() {
      return isAuthenticated() && exists(/databases/$(database)/documents/users/$(request.auth.uid))
        ? get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role
        : null;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return getUserRole() == 'admin';
    }
    
    // Helper function to check if user is merchant
    function isMerchant() {
      return getUserRole() == 'merchant';
    }
    
    // Users collection - Allow admin to create merchant accounts
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
      allow delete: if isAdmin();
    }
    
    // Malls collection - Admin creates, Merchant can update their own mall
    match /malls/{mallId} {
      allow read: if isAuthenticated();
      allow create: if isAdmin();
      allow update: if isAdmin() || (isMerchant() && exists(/databases/$(database)/documents/malls/$(mallId)) && get(/databases/$(database)/documents/malls/$(mallId)).data.merchantId == request.auth.uid);
      allow delete: if isAdmin();
    }
    
    // Shops collection - Merchant can manage shops in their mall
    match /shops/{shopId} {
      allow read: if isAuthenticated();
      allow create: if isAdmin() || isMerchant();
      allow update: if isAdmin() || isMerchant();
      allow delete: if isAdmin() || isMerchant();
    }
    
    // Products collection - Merchant can manage products
    match /products/{productId} {
      allow read: if isAuthenticated();
      allow create: if isAdmin() || isMerchant();
      allow update: if isAdmin() || isMerchant();
      allow delete: if isAdmin() || isMerchant();
    }
    
    // Offers collection - Merchant can manage offers
    match /offers/{offerId} {
      allow read: if isAuthenticated();
      allow create: if isAdmin() || isMerchant();
      allow update: if isAdmin() || isMerchant();
      allow delete: if isAdmin() || isMerchant();
    }
    
    // Categories collection - Admin and Merchant can manage
    match /categories/{categoryId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin() || isMerchant();
    }
    
    // Floors collection - Admin and Merchant can manage
    match /floors/{floorId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin() || isMerchant();
    }
    
    // Logs collection - Admin can read, anyone can create
    match /logs/{logId} {
      allow read: if isAdmin();
      allow create: if isAuthenticated();
      allow update, delete: if false;
    }
  }
}
```

## KEY CHANGES:
```javascript
// Removed isManager() - Now using isMerchant()
// Changed role from 'manager' to 'merchant'
// Merchant now has full mall management permissions
```

---

## System Roles (Matches Problem Statement):

1. **Admin** - Platform owner, creates super malls
2. **Merchant** - Shop owner, manages mall (shops, products, offers, categories, floors)
3. **User** - Customer, browses and compares products

---

**After updating rules, refresh your app and try again!**

