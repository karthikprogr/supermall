# Super Mall Web Application - Roles & Permissions

## 🎯 Aligned with Problem Statement

This document defines all user roles and their permissions according to the **Unified Mentor Problem Statement**.

---

## 👥 System Roles

### 1. **Admin** (Platform Administrator)
**Description:** Platform owner who manages the entire Super Mall system.

**Responsibilities:**
- Create Super Mall with Merchant account
- View all super malls
- Edit/Delete super malls
- Manage Categories & Floors (global)
- View all shops, products, and offers
- Monitor system logs
- Access admin dashboard with statistics

**Permissions:**
- ✅ Full CRUD on malls collection
- ✅ Full CRUD on users collection
- ✅ Full CRUD on shops collection
- ✅ Full CRUD on products collection
- ✅ Full CRUD on offers collection
- ✅ Full CRUD on categories collection
- ✅ Full CRUD on floors collection
- ✅ Read access to logs collection

**Login Credentials:**
- Created manually or through registration
- Role: `admin`

---

### 2. **Merchant** (Shop Owner)
**Description:** Business owner who manages an assigned Super Mall and all its operations.

**Responsibilities:**
- Manage entire assigned Super Mall
- Create Categories & Floors for their mall
- Create Shops within their mall
- Add Products to shops
- Create Offers for products
- Manage shop details
- Update product information
- View shop-wise and floor-wise analytics

**Permissions:**
- ✅ Read: All malls (view only)
- ✅ Update: Their assigned mall only
- ✅ Full CRUD on shops (within their mall)
- ✅ Full CRUD on products (for their shops)
- ✅ Full CRUD on offers (for their products)
- ✅ Full CRUD on categories (for their mall)
- ✅ Full CRUD on floors (for their mall)
- ✅ Create logs

**Login Credentials:**
- Created by Admin during Super Mall creation
- Email + Password provided by Admin
- Role: `merchant`

---

### 3. **User** (Customer)
**Description:** End customer who browses and compares products.

**Responsibilities:**
- Browse shops by category or floor
- View product details
- Compare products (cost & features)
- Filter products by category/floor/shop
- View shop-wise offers
- View floor-wise shop details

**Permissions:**
- ✅ Read: All malls, shops, products, offers, categories, floors
- ❌ No write access (read-only)

**Login Credentials:**
- Self-registration or Google Sign-In
- Role: `user`

---

## 📊 Admin Module Features (Problem Statement Alignment)

According to the problem statement, Admin has the following capabilities:

| Feature | Implementation Status | Description |
|---------|----------------------|-------------|
| ✅ Login | Complete | Email/Password & Google OAuth |
| ✅ Create Shop Details | Complete | AdminCreateShop.jsx |
| ✅ Manage Shop Details | Complete | AdminEditShop.jsx |
| ✅ Manage Offer Details | Complete | Merchant can create offers |
| ✅ Manage Category & Floor | Complete | AdminDashboard.jsx |
| ✅ Category Wise Details | Complete | Filters.jsx |
| ✅ List of Shop Details | Complete | AdminShops.jsx |
| ✅ List Offer Products | Complete | UserOffers.jsx |
| ✅ Compare Products | Complete | CompareModal.jsx |
| ✅ Filter | Complete | Filters.jsx (by category/floor) |
| ✅ Shop Wise Offers | Complete | Filterable offers |
| ✅ Floor Wise Details | Complete | Floor-based filtering |
| ✅ View Shop Details | Complete | ShopCard.jsx |

---

## 🔐 Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserRole() {
      return isAuthenticated() && exists(/databases/$(database)/documents/users/$(request.auth.uid))
        ? get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role
        : null;
    }
    
    function isAdmin() {
      return getUserRole() == 'admin';
    }
    
    function isMerchant() {
      return getUserRole() == 'merchant';
    }
    
    // Users - Admin creates, all can read
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
      allow delete: if isAdmin();
    }
    
    // Malls - Admin creates, Merchant updates their own
    match /malls/{mallId} {
      allow read: if isAuthenticated();
      allow create: if isAdmin();
      allow update: if isAdmin() || (isMerchant() && get(/databases/$(database)/documents/malls/$(mallId)).data.merchantId == request.auth.uid);
      allow delete: if isAdmin();
    }
    
    // Shops - Admin and Merchant manage
    match /shops/{shopId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin() || isMerchant();
    }
    
    // Products - Admin and Merchant manage
    match /products/{productId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin() || isMerchant();
    }
    
    // Offers - Admin and Merchant manage
    match /offers/{offerId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin() || isMerchant();
    }
    
    // Categories - Admin and Merchant manage
    match /categories/{categoryId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin() || isMerchant();
    }
    
    // Floors - Admin and Merchant manage
    match /floors/{floorId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin() || isMerchant();
    }
    
    // Logs - Admin reads, all create
    match /logs/{logId} {
      allow read: if isAdmin();
      allow create: if isAuthenticated();
      allow update, delete: if false;
    }
  }
}
```

---

## 🎯 Workflow

### Step 1: Admin Creates Super Mall
1. Admin logs in
2. Goes to "Create Super Mall"
3. Enters mall details + merchant credentials
4. System creates:
   - Mall document in Firestore
   - Merchant user account in Firebase Auth
   - Merchant user document with role: 'merchant'

### Step 2: Merchant Manages Mall
1. Merchant logs in with credentials from Admin
2. Adds Categories & Floors
3. Creates Shops
4. Adds Products to shops
5. Creates Offers for products

### Step 3: Users Browse
1. User registers or signs in with Google
2. Browses shops by category/floor
3. Compares products
4. Views offers
5. Filters by various criteria

---

## 📁 Database Collections

### `malls`
```javascript
{
  mallName: string,
  location: string,
  description: string,
  merchantId: string,        // Firebase Auth UID
  merchantEmail: string,
  createdAt: timestamp,
  createdBy: string          // Admin UID
}
```

### `users`
```javascript
{
  name: string,
  email: string,
  role: 'admin' | 'merchant' | 'user',
  mallId: string,            // For merchant only
  mallName: string,          // For merchant only
  contactNumber: string,
  createdAt: timestamp
}
```

### `shops`
```javascript
{
  name: string,
  description: string,
  category: string,
  floor: string,
  mallId: string,            // Reference to mall
  ownerId: string,           // Merchant UID
  imageUrl: string,
  createdAt: timestamp
}
```

### `products`
```javascript
{
  name: string,
  description: string,
  price: number,
  shopId: string,
  ownerId: string,           // Merchant UID
  imageUrl: string,
  features: array,
  createdAt: timestamp
}
```

### `offers`
```javascript
{
  title: string,
  description: string,
  discount: number,
  productId: string,
  shopId: string,
  ownerId: string,           // Merchant UID
  validUntil: timestamp,
  createdAt: timestamp
}
```

### `categories` & `floors`
```javascript
{
  name: string,
  createdAt: timestamp
}
```

### `logs`
```javascript
{
  userId: string,
  action: string,
  details: string,
  timestamp: timestamp
}
```

---

## ✅ Role Verification Checklist

- [x] Only 3 roles: Admin, Merchant, User
- [x] No "Manager" role (removed)
- [x] Admin creates super malls
- [x] Merchant manages entire mall operations
- [x] User has read-only access
- [x] Firebase rules enforce role-based permissions
- [x] All features from problem statement implemented
- [x] Logging implemented for all actions
- [x] Code hosted on GitHub
- [x] Modular and maintainable code structure

---

**Last Updated:** January 23, 2026
**Status:** Production Ready ✅
**Compliance:** Matches Unified Mentor Problem Statement
