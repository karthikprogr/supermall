# Complete Roles & Capabilities Guide

## 🎯 Super Mall Web Application - Role Definitions

---

## 1️⃣ ADMIN ROLE

### **Who is Admin?**
Platform owner who manages the entire Super Mall system.

### **Admin Capabilities:**

#### 🏢 Super Mall Management
- ✅ Create Super Mall (with merchant account creation)
- ✅ View all Super Malls
- ✅ Edit Super Mall details
- ✅ Delete Super Mall
- ✅ View Super Mall statistics

#### 🏪 Shop Management
- ✅ Create Shops (assign to merchant)
- ✅ View all Shops across all malls
- ✅ Edit Shop details
- ✅ Delete Shops
- ✅ Filter shops by category/floor/mall

#### 👥 User Management
- ✅ Create Merchant accounts (during mall creation)
- ✅ View all users (Admin, Merchant, User)
- ✅ Edit user details
- ✅ Delete users
- ✅ View user activity logs

#### 📦 Product Management
- ✅ View all Products across all shops
- ✅ Edit Product details (if needed)
- ✅ Delete Products
- ✅ Monitor product inventory

#### 🎁 Offer Management
- ✅ View all Offers
- ✅ Edit Offer details
- ✅ Delete Offers
- ✅ Monitor offer performance

#### 📂 Category & Floor Management
- ✅ Create Categories
- ✅ Edit Categories
- ✅ Delete Categories
- ✅ Create Floors
- ✅ Edit Floors
- ✅ Delete Floors

#### 📊 Analytics & Reports
- ✅ View dashboard statistics
  - Total Super Malls
  - Total Shops
  - Total Products
  - Total Categories
  - Total Merchants
  - Total Users
- ✅ View all system logs
- ✅ Generate reports

#### 🔐 Security & Access
- ✅ Full read/write access to all collections
- ✅ Can override any permissions
- ✅ Access to system logs

### **Admin Pages:**
```
/admin                          - Dashboard with stats
/admin/malls                    - List all super malls
/admin/create-mall              - Create super mall + merchant
/admin/view-mall/:id            - View mall details
/admin/edit-mall/:id            - Edit mall details
/admin/shops                    - List all shops
/admin/create-shop              - Create shop
/admin/edit-shop/:id            - Edit shop
/admin/merchants                - List all merchants
/admin/create-merchant          - Create merchant account
/admin/edit-merchant/:id        - Edit merchant
```

---

## 2️⃣ MERCHANT ROLE

### **Who is Merchant?**
Shop owner who manages an assigned Super Mall. Created by Admin during mall creation.

### **Merchant Capabilities:**

#### 🏢 Mall Management (Their Assigned Mall)
- ✅ View their assigned Super Mall details
- ✅ Update their mall information
- ❌ Cannot create new malls
- ❌ Cannot delete malls
- ❌ Cannot access other merchants' malls

#### 🏪 Shop Management
- ✅ Create Shops within their mall
- ✅ View all shops in their mall
- ✅ Edit their own shops
- ✅ Delete their own shops
- ✅ Assign shops to categories/floors
- ❌ Cannot access shops from other malls

#### 📦 Product Management
- ✅ Add Products to their shops
- ✅ View all products in their shops
- ✅ Edit their own products
- ✅ Delete their own products
- ✅ Update product prices
- ✅ Update product inventory
- ✅ Upload product images (via Cloudinary)
- ❌ Cannot access products from other merchants

#### 🎁 Offer Management
- ✅ Create Offers for their products
- ✅ View all their offers
- ✅ Edit their own offers
- ✅ Delete their own offers
- ✅ Set offer validity period
- ❌ Cannot create offers for other merchants' products

#### 📂 Category & Floor Management (For Their Mall)
- ✅ Create Categories for their mall
- ✅ Edit Categories in their mall
- ✅ Delete Categories from their mall
- ✅ Create Floors for their mall
- ✅ Edit Floors in their mall
- ✅ Delete Floors from their mall

#### 📊 Analytics (Their Mall Only)
- ✅ View their dashboard statistics
  - Total Shops in their mall
  - Total Products in their shops
  - Total Offers created
  - Total Categories/Floors
- ✅ View their own activity logs
- ❌ Cannot view other merchants' data

#### 🔐 Security & Access
- ✅ Read/Write access to their mall data
- ✅ Read/Write access to their shops
- ✅ Read/Write access to their products
- ✅ Read/Write access to their offers
- ❌ No access to other merchants' data
- ❌ Cannot create/delete users

### **Merchant Pages:**
```
/merchant                       - Dashboard with their mall stats
/merchant/shops                 - List their shops
/merchant/create-shop           - Create shop in their mall
/merchant/products              - List their products
/merchant/add-product           - Add product to shop
/merchant/offers                - View their offers
/merchant/create-offer          - Create new offer
```

---

## 3️⃣ USER ROLE

### **Who is User?**
Customer who browses shops and products. Can self-register or use Google Sign-In.

### **User Capabilities:**

#### 🏢 Mall Browsing
- ✅ View all Super Malls
- ✅ View mall locations
- ✅ View mall descriptions
- ❌ Cannot create/edit/delete malls

#### 🏪 Shop Browsing
- ✅ View all shops across all malls
- ✅ Filter shops by:
  - Category
  - Floor
  - Mall
- ✅ View shop details
- ✅ View shop images
- ❌ Cannot create/edit/delete shops

#### 📦 Product Browsing
- ✅ View all products
- ✅ View product details
- ✅ View product prices
- ✅ View product features
- ✅ Filter products by:
  - Category
  - Shop
  - Price range
- ✅ **Compare Products** (cost & features)
- ❌ Cannot create/edit/delete products

#### 🎁 Offer Browsing
- ✅ View all active offers
- ✅ View offer details (discount, validity)
- ✅ Filter offers by:
  - Shop
  - Category
  - Discount percentage
- ✅ View shop-wise offers
- ❌ Cannot create/edit/delete offers

#### 📂 Category & Floor Browsing
- ✅ View all categories
- ✅ View all floors
- ✅ Filter by category-wise details
- ✅ Filter by floor-wise details
- ❌ Cannot create/edit/delete categories/floors

#### 🔍 Search & Filter
- ✅ Search shops by name
- ✅ Search products by name
- ✅ Filter by multiple criteria
- ✅ Sort by price, name, date

#### 🔐 Security & Access
- ✅ Read-only access to all public data
- ✅ Can update their own profile
- ❌ No write access to shops/products/offers
- ❌ Cannot access admin features
- ❌ Cannot access merchant features

### **User Pages:**
```
/user                           - Dashboard with all shops
/user/shops                     - Browse all shops
/user/products                  - Browse all products
/user/offers                    - Browse all offers
/                               - Home page with filters
```

---

## 📊 Role Comparison Table

| Feature | Admin | Merchant | User |
|---------|-------|----------|------|
| **Create Super Mall** | ✅ | ❌ | ❌ |
| **View Super Malls** | ✅ All | ✅ Their own | ✅ All |
| **Edit Super Mall** | ✅ All | ✅ Their own | ❌ |
| **Delete Super Mall** | ✅ | ❌ | ❌ |
| **Create Shop** | ✅ | ✅ | ❌ |
| **View Shops** | ✅ All | ✅ Their mall | ✅ All |
| **Edit Shop** | ✅ All | ✅ Their shops | ❌ |
| **Delete Shop** | ✅ All | ✅ Their shops | ❌ |
| **Add Product** | ✅ | ✅ | ❌ |
| **View Products** | ✅ All | ✅ Their products | ✅ All |
| **Edit Product** | ✅ All | ✅ Their products | ❌ |
| **Delete Product** | ✅ All | ✅ Their products | ❌ |
| **Create Offer** | ✅ | ✅ | ❌ |
| **View Offers** | ✅ All | ✅ Their offers | ✅ All |
| **Edit Offer** | ✅ All | ✅ Their offers | ❌ |
| **Delete Offer** | ✅ All | ✅ Their offers | ❌ |
| **Manage Categories** | ✅ | ✅ | ❌ |
| **Manage Floors** | ✅ | ✅ | ❌ |
| **View Users** | ✅ | ❌ | ❌ |
| **Create Merchant** | ✅ | ❌ | ❌ |
| **View Logs** | ✅ | ✅ Own | ❌ |
| **Compare Products** | ✅ | ✅ | ✅ |
| **Filter & Search** | ✅ | ✅ | ✅ |

---

## 🔄 Workflow Example

### Scenario: Admin creates a mall, merchant adds products, user browses

```
1. ADMIN WORKFLOW:
   ┌─────────────────────────────────────┐
   │ 1. Login as Admin                   │
   │ 2. Go to "Create Super Mall"        │
   │ 3. Enter Mall Details:              │
   │    - Mall Name: "Phoenix Mall"      │
   │    - Location: "Bangalore"          │
   │ 4. Enter Merchant Details:          │
   │    - Name: "John Doe"               │
   │    - Email: "john@example.com"      │
   │    - Password: "secure123"          │
   │ 5. Submit                           │
   │ 6. System creates:                  │
   │    ✅ Mall document                 │
   │    ✅ Merchant account              │
   └─────────────────────────────────────┘

2. MERCHANT WORKFLOW:
   ┌─────────────────────────────────────┐
   │ 1. Login with credentials from Admin│
   │ 2. Dashboard shows "Phoenix Mall"   │
   │ 3. Create Categories:               │
   │    - Electronics                    │
   │    - Fashion                        │
   │ 4. Create Floors:                   │
   │    - Ground Floor                   │
   │    - First Floor                    │
   │ 5. Create Shop:                     │
   │    - Name: "Tech Store"             │
   │    - Category: Electronics          │
   │    - Floor: First Floor             │
   │ 6. Add Products:                    │
   │    - iPhone 15 Pro                  │
   │    - Samsung Galaxy S24             │
   │ 7. Create Offer:                    │
   │    - "20% Off on iPhones"           │
   └─────────────────────────────────────┘

3. USER WORKFLOW:
   ┌─────────────────────────────────────┐
   │ 1. Register or Login                │
   │ 2. Browse Shops                     │
   │ 3. Filter by "Electronics"          │
   │ 4. View "Tech Store"                │
   │ 5. See Products:                    │
   │    - iPhone 15 Pro - ₹99,999       │
   │    - Samsung S24 - ₹79,999          │
   │ 6. Click "Compare Products"         │
   │ 7. Compare features & prices        │
   │ 8. View active offers               │
   │ 9. See "20% Off on iPhones"         │
   └─────────────────────────────────────┘
```

---

## 🔒 Security Implementation

### Authentication
```javascript
// Firebase Authentication
- Email/Password login
- Google OAuth
- Role stored in Firestore users collection
```

### Authorization (Firebase Rules)
```javascript
// Role-based access control
- Admin: Full access
- Merchant: Access to their mall data only
- User: Read-only access
```

### Data Validation
```javascript
// Input validation (validation.js)
- validateRequired()
- validateEmail()
- validatePassword()
- validateURL()
```

### Logging
```javascript
// Activity logging (logger.js)
- All admin actions logged
- All merchant actions logged
- User actions optionally logged
```

---

## 📝 Summary

**3 ROLES - CLEAR HIERARCHY:**

```
┌─────────────────────────────────────────────┐
│                   ADMIN                     │
│         (Full Platform Control)             │
│  - Creates Malls                            │
│  - Creates Merchants                        │
│  - Monitors Everything                      │
└──────────────────┬──────────────────────────┘
                   │
                   │ creates
                   ▼
┌─────────────────────────────────────────────┐
│                MERCHANT                     │
│         (Mall-Level Control)                │
│  - Manages Their Mall                       │
│  - Creates Shops                            │
│  - Adds Products                            │
│  - Creates Offers                           │
└──────────────────┬──────────────────────────┘
                   │
                   │ provides content for
                   ▼
┌─────────────────────────────────────────────┐
│                   USER                      │
│         (Customer - Read Only)              │
│  - Browses Shops                            │
│  - Views Products                           │
│  - Compares Products                        │
│  - Views Offers                             │
└─────────────────────────────────────────────┘
```

---

**Last Updated:** January 23, 2026
**Status:** Production Ready ✅
**Compliance:** 100% Aligned with Unified Mentor Problem Statement
