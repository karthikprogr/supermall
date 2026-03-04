# 🏗️ System Architecture Document
## Super Mall Web Application

**Project:** Super Mall Management System  
**Version:** 1.0  
**Date:** March 2026  
**Author:** Karthik  

---

## 📑 Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Architecture Patterns](#architecture-patterns)
4. [System Components](#system-components)
5. [Deployment Architecture](#deployment-architecture)
6. [Data Architecture](#data-architecture)
7. [Security Architecture](#security-architecture)
8. [Integration Architecture](#integration-architecture)
9. [Scalability Considerations](#scalability-considerations)
10. [Technology Stack](#technology-stack)

---

## 1. Executive Summary

### 1.1 Purpose
This document describes the complete system architecture for the Super Mall Web Application, a cloud-based platform connecting rural merchants with digital consumers through a centralized mall management system.

### 1.2 Architectural Goals
- **Scalability:** Handle growing number of malls, merchants, and users
- **Performance:** Fast page loads and responsive UI
- **Security:** Role-based access control and data protection
- **Maintainability:** Modular, clean code structure
- **Availability:** 99.9% uptime through cloud deployment

### 1.3 Key Features
- Multi-role system (Admin, Merchant, User)
- Real-time data synchronization
- Image management via CDN
- Comprehensive logging and monitoring
- Responsive mobile-first design

---

## 2. System Overview

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Desktop    │  │    Tablet    │  │    Mobile    │         │
│  │   Browser    │  │   Browser    │  │   Browser    │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                  │                  │                  │
│         └──────────────────┴──────────────────┘                 │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   VERCEL EDGE NETWORK (CDN)                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         React SPA (Static Assets - Vite Build)          │  │
│  │  • HTML, CSS, JavaScript bundles                        │  │
│  │  • Code splitting & lazy loading                        │  │
│  │  • Service Worker (future)                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  FIREBASE AUTH  │ │ FIREBASE        │ │  CLOUDINARY     │
│                 │ │ FIRESTORE       │ │  CDN            │
│  • User Auth    │ │                 │ │                 │
│  • JWT Tokens   │ │  • NoSQL DB     │ │  • Image Upload │
│  • Email/Pass   │ │  • Real-time    │ │  • Optimization │
│  • Session Mgmt │ │  • Collections  │ │  • Transforms   │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 2.2 System Context

**External Actors:**
- **Admin Users:** System administrators managing malls, merchants, shops
- **Merchant Users:** Shop owners managing products, offers
- **End Users:** Customers browsing products, saving favorites, comparing items

**External Systems:**
- **Firebase Services:** Authentication, Database, Storage
- **Cloudinary:** Image hosting and optimization
- **Vercel:** Hosting and deployment platform
- **GitHub:** Source code repository

---

## 3. Architecture Patterns

### 3.1 Client-Side Architecture

**Pattern:** Single Page Application (SPA)

```
┌─────────────────────────────────────────────────────┐
│                   React Application                 │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │          Presentation Layer                  │  │
│  │  • Components (Functional)                   │  │
│  │  • Pages (Route Components)                  │  │
│  │  • Styling (CSS Modules)                     │  │
│  └────────────────┬─────────────────────────────┘  │
│                   │                                 │
│  ┌────────────────▼─────────────────────────────┐  │
│  │          Business Logic Layer                │  │
│  │  • Context Providers (Auth, User)            │  │
│  │  • Custom Hooks                              │  │
│  │  • Validation Utilities                      │  │
│  └────────────────┬─────────────────────────────┘  │
│                   │                                 │
│  ┌────────────────▼─────────────────────────────┐  │
│  │          Data Access Layer                   │  │
│  │  • Firebase SDK                              │  │
│  │  • API Wrappers                              │  │
│  │  • Logger Service                            │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Benefits:**
- Fast navigation (no page reloads)
- Rich user interactions
- Offline capability potential
- Mobile-friendly

### 3.2 Data Flow Pattern

**Unidirectional Data Flow:**

```
┌─────────────┐
│ User Action │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Event Handler  │
│  (Component)    │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Context API /  │
│  State Update   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Firebase API    │
│ Call            │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Firestore DB    │
│ Update          │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Real-time       │
│ Listener        │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Component       │
│ Re-render       │
└─────────────────┘
```

### 3.3 State Management Pattern

**Context API + Local State:**

```
Global State (Context API)
├── AuthContext
│   ├── currentUser
│   ├── userRole
│   └── Methods: login(), logout(), register()
└── UserContext
    ├── selectedMall
    ├── savedItems
    ├── comparisonList
    └── Methods: toggleSavedItem(), addToComparison()

Component Local State (useState)
├── Form data (controlled inputs)
├── Loading states
├── Error messages
└── UI states (modals, dropdowns)
```

---

## 4. System Components

### 4.1 Frontend Components

#### Core Application Components

```
App.jsx (Root)
│
├── Routing System
│   ├── React Router DOM
│   ├── Protected Routes
│   └── Role-based Routing
│
├── Global Contexts
│   ├── AuthContext Provider
│   └── UserContext Provider
│
├── Layout Components
│   ├── Navbar
│   ├── MobileBottomNav
│   └── Footer (future)
│
└── Feature Modules
    ├── Admin Module
    ├── Merchant Module
    └── User Module
```

#### Component Breakdown

**Admin Module Components:**
```
AdminDashboard
├── Statistics Cards
├── Quick Actions
└── Recent Activity

AdminMalls
├── Mall List View
├── Create Mall Form
├── Edit Mall Form
└── View Mall Details

AdminMerchants
├── Merchant List
├── Create Merchant
├── Edit Merchant
└── Activate/Deactivate

AdminShops
├── Shop List (filtered by mall)
├── Create Shop
├── Edit Shop
└── Shop Details View
```

**Merchant Module Components:**
```
MerchantDashboard
├── Shop Statistics
├── Product Overview
└── Offer Management

MerchantShops
├── My Shops List
├── Create Shop
└── Edit Shop

MerchantProducts
├── Product Grid
├── Add Product
├── Edit Product
└── Delete Product

CreateOffer
├── Product Selection
├── Discount Configuration
└── Validity Period
```

**User Module Components:**
```
MallSelection
├── Mall Cards Grid
└── Mall Search

UserShops
├── Shop Grid (by mall)
├── Floor Filter
└── Category Filter

UserProducts
├── Product Grid
├── Advanced Filters
├── Search Bar
├── Save Button
└── Compare Button

UserSavedItems
├── Saved Products List
└── Remove from Saved

UserCompare
├── Comparison Table
├── Side-by-side View
└── Best Deal Indicator

UserOffers
├── Active Offers Grid
└── Discount Display

UserAccount
├── Profile Information
├── Saved Preferences
└── Logout
```

### 4.2 Backend Services (Firebase)

#### Firebase Authentication

```
Authentication Service
│
├── Email/Password Authentication
│   ├── Sign Up
│   ├── Sign In
│   ├── Sign Out
│   └── Password Reset
│
├── Session Management
│   ├── JWT Token Generation
│   ├── Token Refresh
│   └── Token Validation
│
└── User State Management
    ├── onAuthStateChanged Listener
    └── Persistent Login
```

#### Firebase Firestore

```
Firestore Database
│
├── Collections
│   ├── users
│   ├── malls
│   ├── shops
│   ├── products
│   ├── offers
│   └── logs
│
├── Security Rules
│   ├── Role-based Access
│   ├── Document Ownership
│   └── Field Validation
│
└── Queries
    ├── Filtered Queries
    ├── Compound Queries
    └── Real-time Listeners
```

#### Firebase Storage

```
Firebase Storage
│
├── User Uploads (legacy)
│   ├── Product Images
│   ├── Shop Images
│   └── Mall Images
│
└── Storage Rules
    ├── Authenticated Upload
    └── File Size Limits
```

### 4.3 Third-Party Services

#### Cloudinary CDN

```
Cloudinary Service
│
├── Image Upload
│   ├── Direct Upload API
│   ├── Upload Presets
│   └── Folder Organization
│
├── Image Transformations
│   ├── Automatic Optimization
│   ├── Responsive Sizing
│   ├── Format Conversion
│   └── Quality Adjustment
│
└── Delivery
    ├── Global CDN
    ├── Lazy Loading Support
    └── Progressive Loading
```

---

## 5. Deployment Architecture

### 5.1 Deployment Topology

```
┌──────────────────────────────────────────────────────────┐
│                    USERS / CLIENTS                       │
│         (Desktop, Mobile, Tablet Browsers)               │
└────────────────────┬─────────────────────────────────────┘
                     │ HTTPS/SSL
                     ▼
┌──────────────────────────────────────────────────────────┐
│              VERCEL EDGE NETWORK (Global CDN)            │
│  ┌────────────────────────────────────────────────────┐  │
│  │         Edge Locations (100+ worldwide)            │  │
│  │  • Automatic HTTPS                                 │  │
│  │  • DDoS Protection                                 │  │
│  │  • Automatic Failover                              │  │
│  │  • Geo-routing                                     │  │
│  └────────────────────────────────────────────────────┘  │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│         VERCEL SERVERLESS PLATFORM (us-east-1)           │
│  ┌────────────────────────────────────────────────────┐  │
│  │      Static Assets (dist/ folder)                  │  │
│  │  • HTML (index.html)                               │  │
│  │  • JavaScript Bundles (chunked)                    │  │
│  │  • CSS Files                                       │  │
│  │  • Images, Fonts                                   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │      Environment Variables                         │  │
│  │  • VITE_FIREBASE_API_KEY                           │  │
│  │  • VITE_CLOUDINARY_CLOUD_NAME                      │  │
│  │  • VITE_CLOUDINARY_UPLOAD_PRESET                   │  │
│  └────────────────────────────────────────────────────┘  │
└────────────────────┬─────────────────────────────────────┘
                     │
         ┌───────────┴────────────┬──────────────────┐
         │                        │                  │
         ▼                        ▼                  ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ FIREBASE SERVICES│  │   CLOUDINARY     │  │   GITHUB REPO    │
│  (us-central1)   │  │   (Global CDN)   │  │   (source)       │
│                  │  │                  │  │                  │
│  • Auth          │  │  • Images Store  │  │  • Version Ctrl  │
│  • Firestore     │  │  • Optimization  │  │  • Auto-deploy   │
│  • Storage       │  │  • Delivery      │  │  • CI/CD         │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

### 5.2 Deployment Process (CI/CD)

```
Developer Workflow
─────────────────

1. Local Development
   ├── npm run dev (Vite dev server)
   ├── Code changes
   └── Local testing

2. Git Commit
   ├── git add .
   ├── git commit -m "message"
   └── git push origin main

3. GitHub Repository
   ├── Code pushed to main branch
   └── Webhook triggers Vercel

4. Vercel Build Process
   ├── Detect changes
   ├── Install dependencies (npm install)
   ├── Run build (npm run build)
   ├── Generate static files (dist/)
   └── Deploy to edge network

5. Production Deployment
   ├── Invalidate CDN cache
   ├── Push to edge locations
   ├── Update DNS routing
   └── Live at https://supermall-application.vercel.app

6. Post-Deployment
   ├── Automatic health checks
   ├── Analytics tracking
   └── Error monitoring
```

### 5.3 Environment Configuration

**Development Environment:**
```
Local Machine
├── Node.js 18+
├── npm/yarn
├── Vite Dev Server (port 5173)
├── Hot Module Replacement
└── .env.local (environment variables)
```

**Production Environment:**
```
Vercel Platform
├── Node.js Runtime (latest LTS)
├── Automatic HTTPS
├── Global CDN
├── Environment Variables (dashboard)
└── Custom Domain Support
```

---

## 6. Data Architecture

### 6.1 Database Schema (Firestore)

```
Firebase Firestore (NoSQL)
│
├── users (Collection)
│   └── {userId} (Document)
│       ├── email: String
│       ├── displayName: String
│       ├── role: 'admin' | 'merchant' | 'user'
│       ├── savedItems: Array<String>
│       ├── createdAt: Timestamp
│       └── lastLogin: Timestamp
│
├── malls (Collection)
│   └── {mallId} (Document)
│       ├── mallName: String
│       ├── location: String
│       ├── description: String
│       ├── imageURL: String
│       ├── createdBy: String (adminId)
│       └── createdAt: Timestamp
│
├── shops (Collection)
│   └── {shopId} (Document)
│       ├── shopName: String
│       ├── description: String
│       ├── category: String
│       ├── floor: String
│       ├── location: String
│       ├── mallId: String (Foreign Key)
│       ├── merchantId: String (Foreign Key)
│       ├── imageURL: String
│       └── createdAt: Timestamp
│
├── products (Collection)
│   └── {productId} (Document)
│       ├── name: String
│       ├── price: Number
│       ├── description: String
│       ├── features: String
│       ├── category: String
│       ├── shopId: String (FK)
│       ├── mallId: String (FK)
│       ├── merchantId: String (FK)
│       ├── imageURL: String
│       └── createdAt: Timestamp
│
├── offers (Collection)
│   └── {offerId} (Document)
│       ├── discount: Number (percentage)
│       ├── description: String
│       ├── validUntil: Timestamp
│       ├── productId: String (FK)
│       ├── shopId: String (FK)
│       ├── merchantId: String (FK)
│       └── createdAt: Timestamp
│
└── logs (Collection)
    └── {logId} (Document)
        ├── userId: String
        ├── action: String
        ├── description: String
        ├── metadata: Object
        ├── timestamp: ServerTimestamp
        └── createdAt: String (ISO)
```

### 6.2 Data Relationships

```
Entity Relationship Diagram
─────────────────────────

       ┌──────────┐
       │  USERS   │
       └────┬─────┘
            │
    ┌───────┼──────────┬──────────┐
    │       │          │          │
    │ (role)│     (created by) (owns)
    │       │          │          │
    ▼       ▼          ▼          ▼
 Admin  Merchant    MALLS      SAVED ITEMS
    │       │          │          │
    │  ┌────┴──┐       │          │
    │  │       │       │          │
    │  ▼       ▼       ▼          │
    │ SHOPS ◄─┘    (belongs to)   │
    │  │                          │
    │  │                          │
    │  ▼                          │
    │ PRODUCTS ◄──────────────────┘
    │  │
    │  │
    │  ▼
    │ OFFERS
    │
    └─► LOGS

Relationships:
─────────────
• User (Admin) → Malls (1 : Many)
• User (Merchant) → Shops (1 : Many)
• Mall → Shops (1 : Many)
• Shop → Products (1 : Many)
• Product → Offers (1 : Many)
• User → SavedItems (Many : Many)
• All Entities → Logs (Many : Many)
```

### 6.3 Data Access Patterns

**Query Patterns:**

1. **Get Products by Mall:**
   ```javascript
   WHERE mallId == {mallId}
   ORDER BY createdAt DESC
   ```

2. **Get Shops by Mall and Floor:**
   ```javascript
   WHERE mallId == {mallId} AND floor == {floorName}
   ```

3. **Get Active Offers:**
   ```javascript
   WHERE validUntil >= {currentDate}
   ORDER BY discount DESC
   ```

4. **Get User's Saved Products:**
   ```javascript
   WHERE __name__ IN {savedItemsArray}
   ```

### 6.4 Data Flow Sequence

**Example: Save Product Flow**

```
User                ProductCard         UserContext         Firestore          Logger
│                      │                    │                  │                 │
├─Click Save ─────────►│                    │                  │                 │
│                      │                    │                  │                 │
│                      ├─toggleSavedItem───►│                  │                 │
│                      │                    │                  │                 │
│                      │                    ├─Update Array────►│                 │
│                      │                    │  (append/remove) │                 │
│                      │                    │                  │                 │
│                      │                    │◄─Success─────────┤                 │
│                      │                    │                  │                 │
│                      │                    ├──────Log Action──────────────────►│
│                      │                    │                  │                 │
│                      │◄─State Updated─────┤                  │                 │
│                      │                    │                  │                 │
│◄─Icon Color Change───┤                    │                  │                 │
│   (Visual Feedback)  │                    │                  │                 │
```

---

## 7. Security Architecture

### 7.1 Authentication & Authorization

```
Security Layers
───────────────

Layer 1: Firebase Authentication
├── Email/Password Authentication
├── JWT Token Generation
├── Session Management
└── Token Expiration (1 hour)

Layer 2: Role-Based Access Control (RBAC)
├── User Roles: admin, merchant, user
├── Route Protection
├── Component-level Checks
└── API-level Validation

Layer 3: Firestore Security Rules
├── Read/Write Permissions
├── Document Ownership
├── Field-level Security
└── Data Validation

Layer 4: Client-Side Validation
├── Form Input Sanitization
├── XSS Prevention
├── CSRF Protection
└── Input Length Limits
```

### 7.2 Firestore Security Rules

```javascript
// Firestore Rules Structure
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper Functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid))
             .data.role == 'admin';
    }
    
    function isMerchant() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid))
             .data.role == 'merchant';
    }
    
    // Users Collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if request.auth.uid == userId;
      allow update: if request.auth.uid == userId || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Malls Collection (Admin Only)
    match /malls/{mallId} {
      allow read: if true;  // Public read
      allow create, update, delete: if isAdmin();
    }
    
    // Shops Collection
    match /shops/{shopId} {
      allow read: if true;  // Public read
      allow create: if isMerchant() || isAdmin();
      allow update, delete: if isAdmin() || 
                               (isMerchant() && 
                                resource.data.merchantId == request.auth.uid);
    }
    
    // Products Collection
    match /products/{productId} {
      allow read: if true;  // Public read
      allow create: if isMerchant() || isAdmin();
      allow update, delete: if isAdmin() || 
                               (isMerchant() && 
                                resource.data.merchantId == request.auth.uid);
    }
    
    // Offers Collection
    match /offers/{offerId} {
      allow read: if true;  // Public read
      allow create, update, delete: if isMerchant() || isAdmin();
    }
    
    // Logs Collection
    match /logs/{logId} {
      allow read: if isAdmin();
      allow create: if isAuthenticated();
      allow update, delete: if false;  // Immutable
    }
  }
}
```

### 7.3 Data Protection

```
Data Protection Measures
────────────────────────

1. In Transit
   ├── HTTPS/TLS 1.3
   ├── Certificate Pinning
   └── Secure WebSocket (Firebase)

2. At Rest
   ├── Firebase Encryption (AES-256)
   ├── Cloudinary Encryption
   └── No sensitive data in localStorage

3. Application Level
   ├── Input Sanitization
   ├── SQL Injection Prevention (N/A for NoSQL)
   ├── XSS Protection
   └── CORS Configuration

4. Access Control
   ├── Role-based Permissions
   ├── Document-level Security
   ├── Field-level Validation
   └── API Rate Limiting (Vercel)
```

---

## 8. Integration Architecture

### 8.1 External API Integrations

```
Integration Map
───────────────

React Application
│
├── Firebase SDK Integration
│   ├── @firebase/app
│   ├── @firebase/auth
│   ├── @firebase/firestore
│   └── @firebase/storage
│
├── Cloudinary Integration
│   ├── Direct Upload API
│   ├── REST API (axios)
│   └── Image Delivery URLs
│
└── Browser APIs
    ├── LocalStorage API (preferences)
    ├── SessionStorage API (temp data)
    ├── Fetch API (HTTP requests)
    └── History API (routing)
```

### 8.2 Firebase Integration Flow

```
Application Initialization
──────────────────────────

1. Firebase Config (firebase.js)
   ├── Load environment variables
   ├── Initialize Firebase App
   └── Export services (auth, db, storage)

2. Auth Context Setup
   ├── Import Firebase Auth
   ├── Create onAuthStateChanged listener
   └── Sync user state globally

3. Component Usage
   ├── Import { auth, db } from firebase.js
   ├── Call Firebase methods
   └── Handle responses/errors

Example Flow:
───────────

User Login
│
├── Input email/password
│
├── signInWithEmailAndPassword(auth, email, password)
│
├── Firebase Auth Server validates
│
├── Returns user object + JWT token
│
├── onAuthStateChanged triggers
│
├── Fetch user role from Firestore
│
├── Update AuthContext state
│
└── Navigate to role-based dashboard
```

### 8.3 Cloudinary Integration

```
Image Upload Flow
─────────────────

Merchant Uploads Product Image
│
├── Select image file (input[type=file])
│
├── Create FormData
│   ├── file: imageFile
│   ├── upload_preset: ml_default
│   └── cloud_name: dkjg7kitn
│
├── POST to Cloudinary API
│   URL: https://api.cloudinary.com/v1_1/{cloud}/image/upload
│
├── Cloudinary Processes
│   ├── Validate file
│   ├── Optimize image
│   ├── Generate thumbnail
│   └── Store in CDN
│
├── Return secure_url
│
├── Store URL in Firestore
│
└── Display optimized image
    URL: https://res.cloudinary.com/dkjg7kitn/image/upload/...
```

---

## 9. Scalability Considerations

### 9.1 Horizontal Scaling

```
Scaling Strategy
────────────────

Frontend (Automatic via Vercel)
├── Edge Network (200+ locations)
├── Automatic load balancing
├── Unlimited concurrent users
└── Pay-per-use pricing

Backend (Firebase Auto-scaling)
├── Firestore auto-sharding
├── Concurrent connections: 1M+
├── Storage auto-expansion
└── Auth handles 10K req/sec
```

### 9.2 Performance Optimization

**Code Splitting:**
```javascript
// Route-based splitting
const AdminDashboard = lazy(() => 
  import('./pages/admin/AdminDashboard')
);

// Component-based splitting
const CompareModal = lazy(() => 
  import('./components/CompareModal')
);

// Result: Smaller initial bundle, faster load
```

**Database Indexing:**
```
Firestore Composite Indexes
───────────────────────────

products collection:
├── Index 1: mallId (ASC), createdAt (DESC)
├── Index 2: shopId (ASC), price (ASC)
└── Index 3: category (ASC), createdAt (DESC)

shops collection:
├── Index 1: mallId (ASC), floor (ASC)
└── Index 2: merchantId (ASC), createdAt (DESC)
```

**Caching Strategy:**
```
Cache Layers
────────────

1. Browser Cache
   ├── Static assets (1 year)
   ├── Images (30 days)
   └── API responses (5 minutes)

2. CDN Cache (Vercel)
   ├── HTML (no cache, revalidate)
   ├── JS/CSS (immutable, 1 year)
   └── Images (1 month)

3. Firebase Client SDK
   ├── Offline persistence enabled
   ├── Local cache for queries
   └── Automatic sync on reconnect

4. Cloudinary CDN
   ├── Global edge caching
   ├── Automatic format selection
   └── Responsive image delivery
```

### 9.3 Load Distribution

```
Traffic Distribution
────────────────────

User Request
│
├── DNS Resolution (Vercel)
│   └── Routes to nearest edge location
│
├── Edge Server (CDN)
│   ├── Serves static assets
│   └── Minimal latency (<50ms)
│
├── Firebase Auth (us-central1)
│   ├── Token validation
│   └── Session management
│
├── Firestore (multi-region)
│   ├── Read from nearest replica
│   └── Write to primary region
│
└── Cloudinary (Global CDN)
    ├── Serves from nearest POP
    └── On-the-fly transformations
```

---

## 10. Technology Stack

### 10.1 Frontend Stack

```
Client-Side Technologies
────────────────────────

Core Framework
├── React 18.3.1
│   ├── Functional Components
│   ├── Hooks (useState, useEffect, useContext)
│   └── Context API (State Management)

Build Tool
├── Vite 6.0.5
│   ├── Fast HMR (Hot Module Replacement)
│   ├── ES Modules
│   └── Optimized Production Builds

Routing
├── React Router DOM 7.1.1
│   ├── Client-side Routing
│   ├── Nested Routes
│   └── Protected Routes

Styling
├── CSS3
│   ├── CSS Variables
│   ├── Flexbox & Grid
│   ├── Media Queries
│   └── Custom Properties

HTTP Client
├── Axios 1.7.9
│   ├── Promise-based requests
│   └── Interceptors

Utilities
├── Lucide React (Icons)
└── Date-fns (future date handling)
```

### 10.2 Backend Stack

```
Backend as a Service (BaaS)
───────────────────────────

Firebase Platform
├── Firebase Authentication 11.2.0
│   ├── Email/Password Provider
│   ├── JWT Token Management
│   └── Session Persistence
│
├── Firebase Firestore 11.2.0
│   ├── NoSQL Cloud Database
│   ├── Real-time Synchronization
│   ├── Offline Support
│   └── Security Rules
│
└── Firebase Storage 11.2.0 (legacy)
    ├── File Upload
    ├── Access Control
    └── Download URLs
```

### 10.3 Infrastructure Stack

```
Cloud Infrastructure
────────────────────

Hosting & Deployment
├── Vercel Platform
│   ├── Serverless Functions (potential)
│   ├── Edge Network (200+ locations)
│   ├── Automatic HTTPS
│   ├── Custom Domains
│   └── Git Integration

Image CDN
├── Cloudinary
│   ├── Cloud Name: dkjg7kitn
│   ├── Upload Preset: ml_default
│   ├── Auto Optimization
│   └── Responsive Delivery

Version Control
└── GitHub
    ├── Repository: karthikprogr/supermall
    ├── Branch: main
    └── Vercel Auto-deploy
```

### 10.4 Development Tools

```
Development Environment
───────────────────────

Package Manager
├── npm 10.x
│   └── package.json (dependency management)

Linting & Formatting
├── ESLint 9.17.0
│   ├── React Plugin
│   ├── Hooks Plugin
│   └── Refresh Plugin

Code Editor
├── VS Code (recommended)
│   ├── ES7 React Snippets
│   ├── Firebase Extensions
│   └── ESLint Integration

Browser DevTools
├── React Developer Tools
├── Firebase Emulator Suite (optional)
└── Network Inspector
```

---

## 11. Monitoring & Logging

### 11.1 Logging Architecture

```
Logging System
──────────────

Application Logger (logger.js)
│
├── Log Categories
│   ├── Authentication (logAuth)
│   ├── Admin Actions (logAdmin)
│   ├── Merchant Actions (logShop, logProduct, logOffer)
│   ├── User Actions (logUser)
│   ├── Errors (logError)
│   └── Performance (logPerformance)
│
├── Log Storage
│   └── Firestore 'logs' collection
│       ├── userId
│       ├── action
│       ├── description
│       ├── metadata (JSON)
│       └── timestamp
│
└── Log Consumers
    ├── Admin Dashboard (activity monitoring)
    ├── Error Analysis (debugging)
    └── Performance Metrics (optimization)
```

### 11.2 Monitoring Strategy

```
Monitoring Layers
─────────────────

1. Application Performance
   ├── Page Load Times (logPerformance.pageLoad)
   ├── API Response Times (logPerformance.dataFetch)
   ├── Image Load Times (logPerformance.imageLoad)
   └── User Interactions (onClick, onChange)

2. Error Tracking
   ├── Firebase Errors (logError.firebaseError)
   ├── Upload Errors (logError.uploadError)
   ├── General Errors (logError.general)
   └── Console Error Logs

3. Usage Analytics
   ├── User Actions (logUser.*)
   ├── Feature Adoption
   ├── Popular Products
   └── Active Merchants

4. Infrastructure Monitoring
   ├── Vercel Analytics (built-in)
   ├── Firebase Console Metrics
   └── Cloudinary Usage Stats
```

---

## 12. Disaster Recovery & Backup

### 12.1 Data Backup Strategy

```
Backup Plan
───────────

Firebase Automatic Backups
├── Firestore: Daily automated backups (retention: 7 days)
├── Auth: User data replicated across regions
└── Storage: Redundant storage (99.999999999% durability)

Cloudinary Backups
├── Images stored redundantly
├── Auto-backup to multiple servers
└── Version history (transformations)

Code Repository
├── GitHub: Full version history
├── Branches: main, development (future)
└── Releases: Tagged versions
```

### 12.2 Disaster Recovery

```
Recovery Procedures
───────────────────

Scenario 1: Vercel Outage
├── Automatic failover to backup region
├── CDN serves cached content
└── RTO: < 5 minutes

Scenario 2: Firebase Outage
├── Firestore offline persistence
├── Users see cached data
└── Auto-sync when service restores

Scenario 3: Code Deployment Issue
├── Rollback to previous deployment (Vercel dashboard)
├── Instant rollback (< 1 minute)
└── No data loss

Scenario 4: Data Corruption
├── Restore from Firebase backup
├── Manual review and fix
└── RTO: < 24 hours
```

---

## 13. Future Architecture Enhancements

### 13.1 Planned Improvements

```
Roadmap (Future Versions)
─────────────────────────

Phase 1: Performance
├── Service Worker implementation
├── Progressive Web App (PWA)
├── Offline-first architecture
└── Image lazy loading optimization

Phase 2: Features
├── Real-time chat support
├── Payment gateway integration
├── Notification system (Push)
└── Advanced analytics dashboard

Phase 3: Scalability
├── Microservices architecture (if needed)
├── GraphQL API layer
├── Redis caching layer
└── ElasticSearch for product search

Phase 4: DevOps
├── Automated testing (Jest, Cypress)
├── CI/CD pipelines (GitHub Actions)
├── Staging environment
└── A/B testing infrastructure
```

---

## 14. Architecture Decision Records (ADR)

### ADR-001: Why React over Angular/Vue?
- **Decision:** Use React 18
- **Rationale:** 
  - Large ecosystem and community
  - Vite integration for fast development
  - Hooks API for cleaner code
  - Good job market demand
- **Status:** Approved ✅

### ADR-002: Why Firebase over Custom Backend?
- **Decision:** Use Firebase (BaaS)
- **Rationale:**
  - Rapid development (no backend coding)
  - Real-time capabilities
  - Built-in authentication
  - Automatic scaling
  - Cost-effective for MVP
- **Status:** Approved ✅

### ADR-003: Why Cloudinary over Firebase Storage?
- **Decision:** Use Cloudinary for images
- **Rationale:**
  - Automatic image optimization
  - On-the-fly transformations
  - Global CDN
  - Better performance than Firebase Storage
- **Status:** Approved ✅

### ADR-004: Why Vercel over Netlify/AWS?
- **Decision:** Use Vercel for hosting
- **Rationale:**
  - Seamless Vite integration
  - Global edge network
  - Automatic HTTPS
  - GitHub auto-deployment
  - Free tier sufficient for project
- **Status:** Approved ✅

---

## 15. Conclusion

This system architecture document provides a comprehensive view of the Super Mall Web Application's technical foundation. The architecture prioritizes:

✅ **Scalability** - Cloud-native design with auto-scaling  
✅ **Performance** - CDN delivery, code splitting, caching  
✅ **Security** - Multi-layer security, RBAC, encryption  
✅ **Maintainability** - Modular components, clear separation  
✅ **Reliability** - 99.9% uptime, automatic backups  

The system is production-ready and designed to handle growth from hundreds to millions of users without architectural changes.

---

**Document Version:** 1.0  
**Last Updated:** March 2026  
**Status:** Approved ✅  
**Next Review:** June 2026
