# 🧪 Test Cases Document
## Super Mall Web Application

**Project:** Super Mall Management System  
**Version:** 1.0  
**Date:** March 2026  
**Author:** Karthik  

---

## 📑 Table of Contents

1. [Introduction](#introduction)
2. [Test Strategy](#test-strategy)
3. [Authentication Test Cases](#authentication-test-cases)
4. [Admin Module Test Cases](#admin-module-test-cases)
5. [Merchant Module Test Cases](#merchant-module-test-cases)
6. [User Module Test Cases](#user-module-test-cases)
7. [Integration Test Cases](#integration-test-cases)
8. [Performance Test Cases](#performance-test-cases)
9. [Security Test Cases](#security-test-cases)
10. [Browser Compatibility Tests](#browser-compatibility-tests)
11. [Responsive Design Tests](#responsive-design-tests)

---

## 1. Introduction

### 1.1 Purpose
This document provides comprehensive test cases for all features of the Super Mall Web Application to ensure quality, reliability, and user satisfaction.

### 1.2 Scope
- Functional testing (all features)
- Integration testing (Firebase, Cloudinary)
- Security testing (authentication, authorization)
- Performance testing (load times, responsiveness)
- UI/UX testing (responsive design, accessibility)

### 1.3 Test Environment
- **Frontend:** React 18.3.1 + Vite 6.0.5
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Browsers:** Chrome, Firefox, Safari, Edge
- **Devices:** Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)
- **OS:** Windows, macOS, iOS, Android

---

## 2. Test Strategy

### 2.1 Testing Levels

```
Unit Testing
├── Individual functions
├── Component rendering
└── Utility helpers

Integration Testing
├── Firebase authentication
├── Firestore CRUD operations
├── Cloudinary uploads
└── Context providers

System Testing
├── End-to-end user journeys
├── Role-based workflows
└── Multi-component interactions

Acceptance Testing
├── Business requirements validation
├── User acceptance criteria
└── Deployment verification
```

### 2.2 Test Execution Priority

**P0 (Critical):** Must pass before deployment
- Authentication & Authorization
- Data integrity (CRUD operations)
- Security rules

**P1 (High):** Core functionality
- Product browsing
- Shop management
- Offer creation

**P2 (Medium):** Enhanced features
- Filters and search
- Comparison feature
- Saved items

**P3 (Low):** Nice-to-have
- UI animations
- Performance optimization
- Analytics logging

---

## 3. Authentication Test Cases

### TC-AUTH-001: User Registration (Email/Password)

**Priority:** P0  
**Module:** Authentication  
**Description:** Verify user can register with email and password

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/register` | Registration form displayed |
| 2 | Enter valid email: test@example.com | Email field accepts input |
| 3 | Enter name: John Doe | Name field accepts input |
| 4 | Enter password: Test@1234 | Password field masked |
| 5 | Select role: User | Radio button selected |
| 6 | Click "Register" button | Loading indicator shown |
| 7 | Wait for Firebase response | User created successfully |
| 8 | Check Firestore | User document created in `users` collection |
| 9 | Verify redirect | Navigated to `/user/malls` |

**Expected:** ✅ User registered, document created, redirected  
**Test Data:** email=test@example.com, password=Test@1234, role=user

---

### TC-AUTH-002: User Login (Valid Credentials)

**Priority:** P0  
**Module:** Authentication  
**Description:** Verify user can login with correct credentials

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/login` | Login form displayed |
| 2 | Enter email: test@example.com | Email field populated |
| 3 | Enter password: Test@1234 | Password field masked |
| 4 | Click "Login" button | Loading spinner shown |
| 5 | Firebase authenticates | Success response received |
| 6 | Fetch user role from Firestore | Role retrieved (user) |
| 7 | Update AuthContext | `currentUser` and `userRole` set |
| 8 | Verify navigation | Redirected to `/user/malls` |
| 9 | Check localStorage | Session persisted |

**Expected:** ✅ Login successful, role-based redirect  
**Test Data:** email=test@example.com, password=Test@1234

---

### TC-AUTH-003: Login Failure (Invalid Password)

**Priority:** P0  
**Module:** Authentication  
**Description:** Verify error handling for incorrect password

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/login` | Login form displayed |
| 2 | Enter email: test@example.com | Email valid |
| 3 | Enter password: WrongPassword | Incorrect password |
| 4 | Click "Login" | Firebase auth attempt |
| 5 | Firebase returns error | `auth/wrong-password` |
| 6 | Display error message | "Incorrect password" shown |
| 7 | User remains on login page | No navigation |
| 8 | Check logs collection | Error logged to Firestore |

**Expected:** ❌ Login failed with clear error message  
**Test Data:** email=test@example.com, password=WrongPassword

---

### TC-AUTH-004: Login Failure (User Not Found)

**Priority:** P0  
**Module:** Authentication  
**Description:** Verify error for non-existent user

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/login` | Login form displayed |
| 2 | Enter email: nonexistent@example.com | Email entered |
| 3 | Enter password: AnyPassword123 | Password entered |
| 4 | Click "Login" | Firebase auth attempt |
| 5 | Firebase returns error | `auth/user-not-found` |
| 6 | Display error message | "No user found with this email" |

**Expected:** ❌ Login failed, user-friendly error  
**Test Data:** email=nonexistent@example.com, password=AnyPassword123

---

### TC-AUTH-005: Logout Functionality

**Priority:** P0  
**Module:** Authentication  
**Description:** Verify user can logout successfully

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | User logged in (any role) | Dashboard visible |
| 2 | Click user profile dropdown | Menu appears |
| 3 | Click "Logout" | Confirmation or immediate logout |
| 4 | Firebase signOut() called | Session terminated |
| 5 | AuthContext cleared | `currentUser = null`, `userRole = null` |
| 6 | Check navigation | Redirected to `/login` |
| 7 | Try accessing protected route | Blocked, redirected to login |

**Expected:** ✅ User logged out, session cleared  

---

### TC-AUTH-006: Protected Route Access (Unauthorized)

**Priority:** P0  
**Module:** Authorization  
**Description:** Verify non-authenticated user cannot access protected routes

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | User not logged in | Guest state |
| 2 | Navigate to `/admin` | ProtectedRoute checks auth |
| 3 | Check `currentUser` | null (not authenticated) |
| 4 | Redirect to `/login` | Login page displayed |
| 5 | Try `/merchant` | Same redirect behavior |
| 6 | Try `/user/products` | Redirected to login |

**Expected:** ❌ Access denied, redirected to login  

---

### TC-AUTH-007: Role-Based Access Control

**Priority:** P0  
**Module:** Authorization  
**Description:** Verify users can only access routes for their role

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Login as user role | `userRole = 'user'` |
| 2 | Navigate to `/admin` | ProtectedRoute checks role |
| 3 | Check requiredRole: admin | Role mismatch |
| 4 | Redirect to `/` | Access denied |
| 5 | Try `/merchant` | Redirected (unauthorized) |
| 6 | Navigate to `/user/malls` | ✅ Access granted |

**Expected:** ✅ User can only access user routes  
**Test Data:** Login with user role

---

## 4. Admin Module Test Cases

### TC-ADMIN-001: Create New Mall

**Priority:** P0  
**Module:** Admin - Mall Management  
**Description:** Verify admin can create a new mall

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Login as admin | Navigate to `/admin` |
| 2 | Click "Malls" in nav | `/admin/malls` page loaded |
| 3 | Click "Create New Mall" | Form displayed |
| 4 | Enter mall name: "Phoenix Mall" | Input accepted |
| 5 | Enter location: "Mumbai, MH" | Input accepted |
| 6 | Enter description: "Premium shopping..." | Textarea populated |
| 7 | Upload image (PNG, 2MB) | Cloudinary upload triggered |
| 8 | Wait for upload | `imageURL` returned |
| 9 | Click "Create Mall" | Firestore addDoc called |
| 10 | Check Firestore | New document in `malls` collection |
| 11 | Verify logger | `logAdmin.mallCreate` called |
| 12 | Check navigation | Redirected to `/admin/malls` |
| 13 | Verify mall appears | New mall card visible |

**Expected:** ✅ Mall created successfully  
**Test Data:** name="Phoenix Mall", location="Mumbai, MH"

---

### TC-ADMIN-002: Edit Existing Mall

**Priority:** P1  
**Module:** Admin - Mall Management  
**Description:** Verify admin can edit mall details

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/admin/malls` | Mall list displayed |
| 2 | Click "Edit" on a mall | Navigate to `/admin/malls/edit/:id` |
| 3 | Form pre-filled with data | Existing details shown |
| 4 | Change name: "Phoenix Mall Updated" | Input updated |
| 5 | Change description | Textarea updated |
| 6 | Upload new image (optional) | New image uploaded |
| 7 | Click "Update Mall" | Firestore updateDoc called |
| 8 | Check Firestore | Document updated |
| 9 | Verify logger | `logAdmin.mallUpdate` called |
| 10 | Navigate back | Redirected to `/admin/malls` |
| 11 | Verify changes | Updated name displayed |

**Expected:** ✅ Mall updated successfully  

---

### TC-ADMIN-003: Delete Mall

**Priority:** P1  
**Module:** Admin - Mall Management  
**Description:** Verify admin can delete a mall

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/admin/malls` | Mall list displayed |
| 2 | Click "Delete" on a mall | Confirmation modal appears |
| 3 | Click "Cancel" | Modal closes, no deletion |
| 4 | Click "Delete" again | Modal appears |
| 5 | Click "Confirm Delete" | Firestore deleteDoc called |
| 6 | Check Firestore | Document removed |
| 7 | Verify logger | `logAdmin.mallDelete` called |
| 8 | UI updated | Mall card removed from list |

**Expected:** ✅ Mall deleted with confirmation  

---

### TC-ADMIN-004: Create Merchant Account

**Priority:** P0  
**Module:** Admin - Merchant Management  
**Description:** Verify admin can create merchant user

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/admin/merchants` | Merchant list page |
| 2 | Click "Create New Merchant" | Form displayed |
| 3 | Enter email: merchant@shop.com | Email valid |
| 4 | Enter name: "Shop Owner" | Name entered |
| 5 | Enter password: Merchant@123 | Password valid |
| 6 | Click "Create Merchant" | Firebase createUserWithEmailAndPassword |
| 7 | Set role in Firestore | `{ role: 'merchant' }` |
| 8 | Verify logger | `logAdmin.merchantCreate` logged |
| 9 | Check navigation | Back to merchants list |
| 10 | Verify merchant appears | New merchant in list |

**Expected:** ✅ Merchant account created  
**Test Data:** email=merchant@shop.com, role=merchant

---

### TC-ADMIN-005: View All Shops

**Priority:** P1  
**Module:** Admin - Shop Management  
**Description:** Verify admin can view all shops across all malls

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/admin/shops` | Shops list page |
| 2 | Firestore query all shops | All documents fetched |
| 3 | Display shops as cards | Grid layout |
| 4 | Check shop details | Name, mall, merchant, floor shown |
| 5 | Filter by mall dropdown | Only shops from selected mall |
| 6 | Search by shop name | Filtered results displayed |
| 7 | Click "View" on a shop | Shop details page |

**Expected:** ✅ All shops displayed with filters  

---

## 5. Merchant Module Test Cases

### TC-MERCHANT-001: Create New Shop

**Priority:** P0  
**Module:** Merchant - Shop Management  
**Description:** Verify merchant can create a shop

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Login as merchant | Navigate to `/merchant` |
| 2 | Click "Shops" → "Create Shop" | Form displayed |
| 3 | Select mall from dropdown | Mall selected |
| 4 | Enter shop name: "Fashion Hub" | Input accepted |
| 5 | Enter description: "Trendy clothing..." | Textarea filled |
| 6 | Select category: "Fashion" | Dropdown selected |
| 7 | Enter floor: "Ground Floor" | Input accepted |
| 8 | Enter location: "Section A" | Input accepted |
| 9 | Upload shop image | Cloudinary upload |
| 10 | Click "Create Shop" | Firestore addDoc called |
| 11 | Verify merchantId | Auto-set to `currentUser.uid` |
| 12 | Check logger | `logShop.create` called |
| 13 | Navigate back | `/merchant/shops` |
| 14 | Verify shop appears | New shop in list |

**Expected:** ✅ Shop created with merchant ownership  
**Test Data:** shopName="Fashion Hub", category="Fashion"

---

### TC-MERCHANT-002: Edit Own Shop

**Priority:** P1  
**Module:** Merchant - Shop Management  
**Description:** Verify merchant can edit their own shop

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/merchant/shops` | My shops list |
| 2 | Click "Edit" on own shop | Edit form displayed |
| 3 | Verify ownership check | `shop.merchantId === currentUser.uid` ✅ |
| 4 | Modify shop name | Input updated |
| 5 | Change floor: "First Floor" | Updated |
| 6 | Click "Update Shop" | Firestore updateDoc called |
| 7 | Verify logger | `logShop.update` called |
| 8 | Check Firestore | Document updated |

**Expected:** ✅ Shop updated successfully  

---

### TC-MERCHANT-003: Cannot Edit Other Merchant's Shop

**Priority:** P0  
**Module:** Merchant - Authorization  
**Description:** Verify merchant cannot edit shops from other merchants

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Login as merchant A | Dashboard loaded |
| 2 | Try accessing edit URL of shop owned by merchant B | Route protection |
| 3 | Check ownership | `shop.merchantId !== currentUser.uid` |
| 4 | Display error | "Unauthorized: Not your shop" |
| 5 | Redirect | Back to `/merchant/shops` |

**Expected:** ❌ Access denied, ownership enforced  

---

### TC-MERCHANT-004: Add New Product

**Priority:** P0  
**Module:** Merchant - Product Management  
**Description:** Verify merchant can add product to their shop

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/merchant/products/add` | Add product form |
| 2 | Select shop from dropdown | Only own shops listed |
| 3 | Enter product name: "Wireless Headphones" | Input valid |
| 4 | Enter price: 2999 | Number input |
| 5 | Select category: "Electronics" | Dropdown |
| 6 | Enter description: "High-quality audio..." | Textarea |
| 7 | Enter features: "Bluetooth 5.0, 20hr battery" | Input |
| 8 | Upload product image (2MB JPEG) | Cloudinary upload |
| 9 | Get imageURL | URL returned |
| 10 | Click "Add Product" | Firestore addDoc |
| 11 | Verify fields | `merchantId`, `shopId`, `mallId` auto-set |
| 12 | Check logger | `logProduct.add` called |
| 13 | Navigate to products list | `/merchant/products` |
| 14 | Verify product appears | Product card visible |

**Expected:** ✅ Product added successfully  
**Test Data:** name="Wireless Headphones", price=2999

---

### TC-MERCHANT-005: Edit Product

**Priority:** P1  
**Module:** Merchant - Product Management  
**Description:** Verify merchant can edit their own products

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/merchant/products` | Products list |
| 2 | Click "Edit" on a product | Edit form pre-filled |
| 3 | Change price: 2499 | Price updated |
| 4 | Modify description | Text changed |
| 5 | Upload new image (optional) | New image uploaded |
| 6 | Click "Update Product" | Firestore updateDoc |
| 7 | Verify logger | `logProduct.update` called |
| 8 | Check products list | Updated price displayed |

**Expected:** ✅ Product updated  

---

### TC-MERCHANT-006: Delete Product

**Priority:** P1  
**Module:** Merchant - Product Management  
**Description:** Verify merchant can delete products

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/merchant/products` | Products list |
| 2 | Click "Delete" on a product | Confirmation modal |
| 3 | Click "Confirm" | Firestore deleteDoc |
| 4 | Verify logger | `logProduct.delete` called |
| 5 | UI updated | Product removed from grid |
| 6 | Check Firestore | Document deleted |

**Expected:** ✅ Product deleted with confirmation  

---

### TC-MERCHANT-007: Create Offer

**Priority:** P1  
**Module:** Merchant - Offer Management  
**Description:** Verify merchant can create discount offer

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/merchant/offers/create` | Offer form |
| 2 | Select product from dropdown | Own products only |
| 3 | Enter discount: 25 (%) | Number input |
| 4 | Enter description: "Festival Sale" | Textarea |
| 5 | Select valid until date | Date picker (future date) |
| 6 | Click "Create Offer" | Firestore addDoc |
| 7 | Verify fields | `merchantId`, `shopId`, `productId` set |
| 8 | Check logger | `logOffer.create` called |
| 9 | Navigate to offers list | `/merchant/offers` |
| 10 | Verify offer appears | Offer card with discount badge |

**Expected:** ✅ Offer created successfully  
**Test Data:** discount=25, validUntil="2026-12-31"

---

## 6. User Module Test Cases

### TC-USER-001: Select Mall

**Priority:** P0  
**Module:** User - Mall Selection  
**Description:** Verify user can select a mall to browse

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Login as user | Redirected to `/user/malls` |
| 2 | View all malls | Mall cards displayed |
| 3 | Click "Browse" on Phoenix Mall | UserContext updated |
| 4 | Check context | `selectedMall` set |
| 5 | Navigate to shops | `/user/shops` |
| 6 | Verify mall name displayed | "Shops in Phoenix Mall" |
| 7 | Check logger | `logUser.mallSelect` called |

**Expected:** ✅ Mall selected, context updated  

---

### TC-USER-002: Browse Shops by Floor

**Priority:** P1  
**Module:** User - Shop Browsing  
**Description:** Verify user can filter shops by floor

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/user/shops` | All shops displayed |
| 2 | Select floor filter: "Ground Floor" | Filter applied |
| 3 | Firestore query | `WHERE floor == 'Ground Floor'` |
| 4 | UI updates | Only ground floor shops shown |
| 5 | Count shops | Correct number displayed |
| 6 | Select "All Floors" | All shops visible again |

**Expected:** ✅ Floor filter works correctly  

---

### TC-USER-003: Search Products

**Priority:** P1  
**Module:** User - Product Search  
**Description:** Verify user can search products by name

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/user/products` | All products shown |
| 2 | Enter search term: "headphones" | Input field updated |
| 3 | Debounce wait (500ms) | Search triggered |
| 4 | Filter locally | Products with "headphones" in name |
| 5 | Display results | 3 products found |
| 6 | Verify logger | `logUser.search` called with term |
| 7 | Clear search | All products visible again |

**Expected:** ✅ Search filters products correctly  
**Test Data:** searchTerm="headphones"

---

### TC-USER-004: Save Product

**Priority:** P1  
**Module:** User - Saved Items  
**Description:** Verify user can save products to favorites

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/user/products` | Products displayed |
| 2 | Click ❤️ icon on product | Save handler triggered |
| 3 | Check authentication | User logged in ✅ |
| 4 | UserContext toggleSavedItem | Add to savedItems array |
| 5 | Firestore update | `users/{uid}` document updated |
| 6 | Icon changes | ❤️ → 💚 (saved state) |
| 7 | Check logger | `logUser.productSave` called |
| 8 | Navigate to `/user/saved` | Product appears in saved list |

**Expected:** ✅ Product saved successfully  

---

### TC-USER-005: Unsave Product

**Priority:** P1  
**Module:** User - Saved Items  
**Description:** Verify user can remove product from favorites

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/user/saved` | Saved products shown |
| 2 | Click 💚 icon on saved product | Unsave handler |
| 3 | UserContext toggleSavedItem | Remove from savedItems array |
| 4 | Firestore update | Array updated |
| 5 | Icon changes | 💚 → ❤️ (unsaved) |
| 6 | Check logger | `logUser.productUnsave` called |
| 7 | Product removed from saved list | UI updated |

**Expected:** ✅ Product unsaved  

---

### TC-USER-006: Add Product to Comparison

**Priority:** P2  
**Module:** User - Product Comparison  
**Description:** Verify user can add products to comparison (max 4)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/user/products` | Products displayed |
| 2 | Click ⚖️ "Compare" on product 1 | Added to comparisonList |
| 3 | Check UserContext | `comparisonList.length = 1` |
| 4 | Click compare on product 2 | `comparisonList.length = 2` |
| 5 | Click compare on products 3 & 4 | `comparisonList.length = 4` |
| 6 | Try adding 5th product | Error: "Max 4 products for comparison" |
| 7 | Navigate to `/user/compare` | 4 products in comparison table |
| 8 | Verify logger | `logUser.productCompare` called |

**Expected:** ✅ Max 4 products enforced  

---

### TC-USER-007: Compare Products

**Priority:** P2  
**Module:** User - Product Comparison  
**Description:** Verify user can compare products side-by-side

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Add 3 products to comparison | ComparisonList has 3 items |
| 2 | Navigate to `/user/compare` | Comparison table displayed |
| 3 | Verify columns | 3 product columns + attribute column |
| 4 | Check attributes | Name, Price, Features, Shop, Category |
| 5 | Identify best deal | Lowest price highlighted ✅ |
| 6 | Click "Remove" on product | Removed from comparison |
| 7 | Click "Clear All" | All products removed |

**Expected:** ✅ Comparison table functional  

---

### TC-USER-008: View Active Offers

**Priority:** P1  
**Module:** User - Offers  
**Description:** Verify user can view active discount offers

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/user/offers` | Offers page loaded |
| 2 | Firestore query | `WHERE validUntil >= currentDate` |
| 3 | Display offers | Active offers shown |
| 4 | Check discount badge | "25% OFF" displayed |
| 5 | Click offer | Navigate to product details |
| 6 | Verify logger | `logUser.offerView` called |

**Expected:** ✅ Only active offers shown  

---

## 7. Integration Test Cases

### TC-INT-001: Firebase Authentication Integration

**Priority:** P0  
**Module:** Integration - Firebase Auth  
**Description:** Verify Firebase Auth SDK integration

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Import auth from firebase.js | No errors |
| 2 | Call signInWithEmailAndPassword | Promise resolves |
| 3 | Receive user object | `user.uid`, `user.email` available |
| 4 | Token generated | JWT token in localStorage |
| 5 | onAuthStateChanged listener | Triggers on login/logout |

**Expected:** ✅ Firebase Auth working  

---

### TC-INT-002: Firestore CRUD Operations

**Priority:** P0  
**Module:** Integration - Firestore  
**Description:** Verify Firestore database operations

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | addDoc (create mall) | Document created, ID returned |
| 2 | getDoc (read mall) | Document retrieved |
| 3 | updateDoc (edit mall) | Document updated |
| 4 | deleteDoc (delete mall) | Document removed |
| 5 | getDocs (query shops) | Array of documents |
| 6 | where() query | Filtered results |

**Expected:** ✅ All CRUD operations successful  

---

### TC-INT-003: Cloudinary Image Upload

**Priority:** P0  
**Module:** Integration - Cloudinary  
**Description:** Verify Cloudinary upload integration

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select image file (2MB JPEG) | File selected |
| 2 | Create FormData | file, upload_preset, cloud_name |
| 3 | POST to Cloudinary API | Request sent |
| 4 | Wait for response | 200 OK status |
| 5 | Extract secure_url | URL returned |
| 6 | Verify image accessible | Image loads successfully |
| 7 | Check optimization | Auto-format, auto-quality applied |

**Expected:** ✅ Image uploaded and optimized  
**Test Data:** File: product.jpg (2MB)

---

### TC-INT-004: Real-time Firestore Listener

**Priority:** P1  
**Module:** Integration - Real-time Updates  
**Description:** Verify real-time data synchronization

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Setup onSnapshot listener on products | Listener active |
| 2 | Add new product (different tab) | Firestore updated |
| 3 | Listener triggers | Callback executed |
| 4 | UI updates | New product appears without refresh |

**Expected:** ✅ Real-time sync working  

---

## 8. Performance Test Cases

### TC-PERF-001: Page Load Time

**Priority:** P1  
**Module:** Performance  
**Description:** Verify page loads within acceptable time

| Metric | Target | Measurement |
|--------|--------|-------------|
| Homepage (/) | < 2 seconds | `logPerformance.pageLoad` |
| Login page | < 1.5 seconds | DOMContentLoaded event |
| User dashboard | < 3 seconds | Including data fetch |
| Products page | < 4 seconds | With 50 products |

**Expected:** ✅ All pages load within target  
**Tool:** Chrome DevTools Performance tab

---

### TC-PERF-002: Image Load Optimization

**Priority:** P2  
**Module:** Performance - Images  
**Description:** Verify images load efficiently

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Load products page | Images lazy-loaded |
| 2 | Scroll down | Images load as visible |
| 3 | Check Cloudinary URL | Transformations applied (`w_800,q_auto,f_auto`) |
| 4 | Measure load time | < 500ms per image |
| 5 | Verify logger | `logPerformance.imageLoad` called |

**Expected:** ✅ Images optimized and lazy-loaded  

---

### TC-PERF-003: Firestore Query Performance

**Priority:** P1  
**Module:** Performance - Database  
**Description:** Verify database queries are optimized

| Query | Target Time | Index Required |
|-------|-------------|----------------|
| Get products by mall | < 1 second | mallId (ASC), createdAt (DESC) |
| Get shops by floor | < 800ms | mallId (ASC), floor (ASC) |
| Active offers | < 1 second | validUntil (>=) |

**Expected:** ✅ Queries use composite indexes  
**Tool:** Firebase Console - Firestore Usage

---

## 9. Security Test Cases

### TC-SEC-001: Firestore Security Rules (Create)

**Priority:** P0  
**Module:** Security - Database  
**Description:** Verify create permissions enforced

| Test Case | Expected Behavior |
|-----------|-------------------|
| Unauthenticated user creates product | ❌ Denied (permission-denied) |
| User creates product | ❌ Denied (not merchant/admin) |
| Merchant creates product | ✅ Allowed (with merchantId) |
| Admin creates product | ✅ Allowed |

**Expected:** ✅ Only authorized roles can create  

---

### TC-SEC-002: Firestore Security Rules (Read)

**Priority:** P0  
**Module:** Security - Database  
**Description:** Verify read permissions

| Test Case | Expected Behavior |
|-----------|-------------------|
| Anonymous user reads products | ✅ Allowed (public read) |
| User reads own savedItems | ✅ Allowed |
| User reads other user's savedItems | ❌ Denied |
| User reads malls | ✅ Allowed (public) |

**Expected:** ✅ Public data accessible, private data protected  

---

### TC-SEC-003: Firestore Security Rules (Update)

**Priority:** P0  
**Module:** Security - Database  
**Description:** Verify update permissions

| Test Case | Expected Behavior |
|-----------|-------------------|
| Merchant A updates product owned by Merchant B | ❌ Denied (ownership check) |
| Merchant A updates own product | ✅ Allowed |
| Admin updates any product | ✅ Allowed |
| User updates product | ❌ Denied (not merchant/admin) |

**Expected:** ✅ Ownership enforced  

---

### TC-SEC-004: XSS Prevention

**Priority:** P0  
**Module:** Security - Input Validation  
**Description:** Verify XSS attacks prevented

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter product name: `<script>alert('XSS')</script>` | Input accepted |
| 2 | Submit form | Data saved to Firestore |
| 3 | Display product | Script NOT executed (escaped) |
| 4 | Check HTML | `&lt;script&gt;` (encoded) |

**Expected:** ✅ Scripts escaped, XSS prevented  

---

### TC-SEC-005: SQL Injection (N/A for NoSQL)

**Priority:** P0  
**Module:** Security  
**Description:** Verify SQL injection not applicable

**Status:** ✅ N/A - Firestore is NoSQL, no SQL injection risk  

---

## 10. Browser Compatibility Tests

### TC-COMPAT-001: Chrome Browser

**Priority:** P1  
**Module:** Compatibility  
**Description:** Verify application works in Google Chrome

| Feature | Chrome 120+ | Expected |
|---------|-------------|----------|
| Layout | ✅ Correct | No layout issues |
| Forms | ✅ Functional | All inputs work |
| Firebase | ✅ Working | Auth/Firestore OK |
| Images | ✅ Loaded | Cloudinary images |
| Routing | ✅ Working | No navigation issues |

**Expected:** ✅ Fully functional  

---

### TC-COMPAT-002: Firefox Browser

**Priority:** P1  
**Module:** Compatibility  
**Description:** Verify Firefox compatibility

| Feature | Firefox 120+ | Expected |
|---------|--------------|----------|
| Layout | ✅ Correct | CSS Grid/Flexbox OK |
| Forms | ✅ Functional | Date pickers work |
| Firebase | ✅ Working | All operations OK |
| Routing | ✅ Working | React Router OK |

**Expected:** ✅ Fully functional  

---

### TC-COMPAT-003: Safari Browser

**Priority:** P2  
**Module:** Compatibility  
**Description:** Verify Safari compatibility (macOS/iOS)

| Feature | Safari 16+ | Expected |
|---------|------------|----------|
| Layout | ✅ Correct | Webkit prefixes OK |
| Forms | ✅ Functional | Input styling correct |
| Firebase | ✅ Working | All SDK methods OK |
| Images | ✅ Loaded | WebP fallback works |

**Expected:** ✅ Fully functional  

---

## 11. Responsive Design Tests

### TC-RESP-001: Mobile Portrait (375x667)

**Priority:** P0  
**Module:** Responsive Design  
**Description:** Verify mobile portrait layout

| Element | Expected Behavior |
|---------|-------------------|
| Navbar | Hamburger menu or hidden |
| Bottom nav | Visible with 5 icons |
| Product cards | 1 column grid |
| Forms | Full-width inputs |
| Buttons | Touch-friendly (44px min) |
| Images | Responsive, optimized |

**Expected:** ✅ Mobile-optimized layout  
**Device:** iPhone 12 (375x667)

---

### TC-RESP-002: Tablet Portrait (768x1024)

**Priority:** P1  
**Module:** Responsive Design  
**Description:** Verify tablet layout

| Element | Expected Behavior |
|---------|-------------------|
| Product cards | 2 column grid |
| Navbar | Full navigation visible |
| Bottom nav | Hidden (desktop nav used) |
| Forms | Centered, max-width 600px |

**Expected:** ✅ Tablet-optimized  
**Device:** iPad (768x1024)

---

### TC-RESP-003: Desktop (1920x1080)

**Priority:** P1  
**Module:** Responsive Design  
**Description:** Verify desktop layout

| Element | Expected Behavior |
|---------|-------------------|
| Product cards | 3-4 column grid |
| Navbar | Full horizontal navigation |
| Content | Max-width container (1200px) |
| Images | High-resolution versions |

**Expected:** ✅ Desktop-optimized  

---

## 12. Acceptance Test Cases

### TC-ACC-001: End-to-End Admin Workflow

**Priority:** P0  
**Module:** Acceptance  
**Description:** Complete admin workflow from login to mall creation

| Step | Action | Expected |
|------|--------|----------|
| 1 | Admin login | ✅ Dashboard |
| 2 | Create mall | ✅ Mall created |
| 3 | Create merchant | ✅ Merchant account |
| 4 | Assign shop to merchant | ✅ Shop created |
| 5 | View analytics | ✅ Stats updated |
| 6 | Logout | ✅ Session cleared |

**Expected:** ✅ Complete workflow successful  

---

### TC-ACC-002: End-to-End Merchant Workflow

**Priority:** P0  
**Module:** Acceptance  
**Description:** Complete merchant workflow

| Step | Action | Expected |
|------|--------|----------|
| 1 | Merchant login | ✅ Dashboard |
| 2 | Create shop | ✅ Shop added |
| 3 | Add 5 products | ✅ All products added |
| 4 | Create offer on product | ✅ Offer created |
| 5 | Edit product price | ✅ Updated |
| 6 | Delete product | ✅ Deleted |
| 7 | Logout | ✅ Cleared |

**Expected:** ✅ Complete workflow successful  

---

### TC-ACC-003: End-to-End User Workflow

**Priority:** P0  
**Module:** Acceptance  
**Description:** Complete user shopping journey

| Step | Action | Expected |
|------|--------|----------|
| 1 | User login | ✅ Mall selection |
| 2 | Select mall | ✅ Context updated |
| 3 | Browse shops | ✅ Shops displayed |
| 4 | View products | ✅ Products grid |
| 5 | Search "headphones" | ✅ Filtered results |
| 6 | Save 3 products | ✅ Saved items |
| 7 | Add 3 to comparison | ✅ Comparison list |
| 8 | Compare products | ✅ Table displayed |
| 9 | View offers | ✅ Active offers |
| 10 | Logout | ✅ Session cleared |

**Expected:** ✅ Complete shopping journey successful  

---

## 13. Test Summary

### 13.1 Test Coverage

| Module | Total Tests | Critical (P0) | High (P1) | Medium (P2) |
|--------|-------------|---------------|-----------|-------------|
| Authentication | 7 | 5 | 2 | 0 |
| Admin | 5 | 3 | 2 | 0 |
| Merchant | 7 | 3 | 4 | 0 |
| User | 8 | 2 | 4 | 2 |
| Integration | 4 | 3 | 1 | 0 |
| Performance | 3 | 0 | 2 | 1 |
| Security | 5 | 4 | 1 | 0 |
| Compatibility | 3 | 0 | 2 | 1 |
| Responsive | 3 | 1 | 2 | 0 |
| Acceptance | 3 | 3 | 0 | 0 |
| **TOTAL** | **48** | **24** | **20** | **4** |

### 13.2 Pass/Fail Criteria

**Project Acceptance Criteria:**
- All P0 (Critical) tests: 100% pass
- All P1 (High) tests: 95% pass
- All P2 (Medium) tests: 90% pass
- No critical security vulnerabilities
- All major browsers compatible
- Mobile responsive (320px+)

---

## 14. Conclusion

This comprehensive test plan covers:

✅ **48 detailed test cases** across all modules  
✅ **Functional testing** (authentication, CRUD, workflows)  
✅ **Integration testing** (Firebase, Cloudinary)  
✅ **Performance testing** (load times, optimization)  
✅ **Security testing** (RBAC, XSS prevention)  
✅ **Compatibility testing** (browsers, devices)  
✅ **Acceptance testing** (end-to-end workflows)  

**Next Steps:**
1. Execute all P0 tests before deployment
2. Automate tests using Jest + React Testing Library
3. Setup CI/CD pipeline with GitHub Actions
4. Conduct UAT with real users
5. Monitor production with logging

---

**Document Version:** 1.0  
**Last Updated:** March 2026  
**Status:** Approved ✅  
**Test Execution:** Pending (Manual + Automated)
