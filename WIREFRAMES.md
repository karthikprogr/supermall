# 🎨 Wireframe & UI/UX Documentation
## Super Mall Web Application

**Project:** Super Mall Management System  
**Version:** 1.0  
**Date:** March 2026  
**Author:** Karthik  

---

## 📑 Table of Contents

1. [Introduction](#introduction)
2. [Design Principles](#design-principles)
3. [User Flows](#user-flows)
4. [Screen Wireframes](#screen-wireframes)
5. [Component Library](#component-library)
6. [Responsive Design](#responsive-design)
7. [Color Palette](#color-palette)
8. [Typography](#typography)
9. [Iconography](#iconography)
10. [Accessibility](#accessibility)

---

## 1. Introduction

### 1.1 Purpose
This document provides comprehensive wireframes and UI/UX specifications for the Super Mall Web Application across all user roles (Admin, Merchant, User).

### 1.2 Scope
- User journey maps
- Screen-level wireframes
- Component specifications
- Responsive layouts
- Design system guidelines

### 1.3 Target Audience
- Developers implementing UI
- Designers creating mockups
- Product managers reviewing flows
- QA testers validating UX

---

## 2. Design Principles

### 2.1 Core Principles

**1. Simplicity First**
- Clean, uncluttered interfaces
- Minimal cognitive load
- Clear visual hierarchy

**2. Role-Based Experience**
- Tailored dashboards for each role
- Context-aware navigation
- Permission-based UI elements

**3. Mobile-First Approach**
- Responsive design (320px - 2560px)
- Touch-friendly controls
- Bottom navigation for mobile

**4. Performance**
- Lazy-loaded images
- Skeleton loaders
- Optimistic UI updates

**5. Accessibility**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support

---

## 3. User Flows

### 3.1 Admin User Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   ADMIN USER JOURNEY                        │
└─────────────────────────────────────────────────────────────┘

Start
  │
  ▼
┌──────────────┐
│  Homepage    │
│  (/)         │
└──────┬───────┘
       │ Click "Login"
       ▼
┌──────────────┐
│ Login Page   │
│ (/login)     │
├──────────────┤
│ • Email      │
│ • Password   │
│ • [Submit]   │
└──────┬───────┘
       │ Enter credentials (role: admin)
       ▼
   [Firebase Auth]
       │
       ▼
┌──────────────────┐
│ Admin Dashboard  │
│ (/admin)         │
├──────────────────┤
│ • Total Malls    │
│ • Merchants      │
│ • Shops          │
│ • Quick Actions  │
└──────┬───────────┘
       │
   ┌───┴────┬──────────┬──────────┐
   │        │          │          │
   ▼        ▼          ▼          ▼
┌─────┐ ┌────────┐ ┌─────────┐ ┌────────┐
│Malls│ │Merchants│ │Shops    │ │Logout  │
└──┬──┘ └────┬───┘ └────┬────┘ └────────┘
   │         │          │
   ▼         ▼          ▼
┌─────────────────────────────────────────┐
│        Mall Management Flow              │
├─────────────────────────────────────────┤
│ 1. View all malls (cards/list)          │
│ 2. Create new mall                      │
│    ├─ Upload image (Cloudinary)         │
│    ├─ Enter details (name, location)     │
│    └─ Save to Firestore                 │
│ 3. Edit existing mall                   │
│ 4. Delete mall (with confirmation)      │
│ 5. View mall details                    │
└─────────────────────────────────────────┘

Similar flows for:
- Merchant Management (Create, Edit, View, Activate/Deactivate)
- Shop Management (Create, Edit, Delete, Assign to Mall)
```

### 3.2 Merchant User Flow

```
┌─────────────────────────────────────────────────────────────┐
│                 MERCHANT USER JOURNEY                       │
└─────────────────────────────────────────────────────────────┘

Start
  │
  ▼
┌──────────────┐
│ Login Page   │
└──────┬───────┘
       │ Login with merchant credentials
       ▼
┌─────────────────────┐
│ Merchant Dashboard  │
│ (/merchant)         │
├─────────────────────┤
│ • My Shops Count    │
│ • Products Count    │
│ • Active Offers     │
│ • Quick Actions     │
└──────┬──────────────┘
       │
   ┌───┴────────┬─────────────┬──────────┐
   │            │             │          │
   ▼            ▼             ▼          ▼
┌──────┐  ┌─────────┐  ┌─────────┐  ┌──────┐
│Shops │  │Products │  │Offers   │  │Account│
└──┬───┘  └────┬────┘  └────┬────┘  └───────┘
   │           │            │
   ▼           ▼            ▼
┌────────────────────────────────────────────┐
│         Shop Management Flow               │
├────────────────────────────────────────────┤
│ 1. View My Shops (/merchant/shops)         │
│    └─ Filter by mall                       │
│                                            │
│ 2. Create New Shop                         │
│    ┌──────────────────────────────┐       │
│    │ Select Mall (dropdown)       │       │
│    │ Shop Name                    │       │
│    │ Description                  │       │
│    │ Category (Fashion, Food...)  │       │
│    │ Floor                        │       │
│    │ Location (Section A/B/C)     │       │
│    │ Upload Image                 │       │
│    │ [Submit]                     │       │
│    └──────────────────────────────┘       │
│                                            │
│ 3. Edit Shop                               │
│ 4. View Shop Details                       │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│       Product Management Flow              │
├────────────────────────────────────────────┤
│ 1. View My Products (/merchant/products)   │
│    ├─ Grid view                            │
│    ├─ Filter by shop                       │
│    └─ Search products                      │
│                                            │
│ 2. Add New Product                         │
│    ┌──────────────────────────────┐       │
│    │ Select Shop (dropdown)       │       │
│    │ Product Name                 │       │
│    │ Price (₹)                    │       │
│    │ Description                  │       │
│    │ Features                     │       │
│    │ Category                     │       │
│    │ Upload Image                 │       │
│    │ [Add Product]                │       │
│    └──────────────────────────────┘       │
│                                            │
│ 3. Edit Product                            │
│    └─ Same form, pre-filled               │
│                                            │
│ 4. Delete Product                          │
│    └─ Confirmation modal                   │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│          Offer Management Flow             │
├────────────────────────────────────────────┤
│ 1. View My Offers (/merchant/offers)       │
│    └─ Active vs Expired                    │
│                                            │
│ 2. Create New Offer                        │
│    ┌──────────────────────────────┐       │
│    │ Select Product (dropdown)    │       │
│    │ Discount % (e.g., 25)        │       │
│    │ Description                  │       │
│    │ Valid Until (date picker)    │       │
│    │ [Create Offer]               │       │
│    └──────────────────────────────┘       │
└────────────────────────────────────────────┘
```

### 3.3 End User Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER JOURNEY                             │
└─────────────────────────────────────────────────────────────┘

Start
  │
  ▼
┌──────────────┐
│ Homepage (/) │
├──────────────┤
│ • Hero       │
│ • Features   │
│ • CTA        │
└──────┬───────┘
       │ Click "Get Started" or "Login"
       ▼
   ┌──────────┐
   │ Register │  OR  ┌────────┐
   │ (/register)│    │ Login  │
   └──────┬───┘     └────┬───┘
          │              │
          └──────┬───────┘
                 ▼
        [Firebase Authentication]
                 │
                 ▼
        ┌────────────────┐
        │ Role Selection │ (if first login)
        │ Modal          │
        ├────────────────┤
        │ ○ Admin        │
        │ ○ Merchant     │
        │ ● User ✓       │
        └────────┬───────┘
                 │ Select "User"
                 ▼
┌─────────────────────────┐
│ Mall Selection Page     │
│ (/user/malls)           │
├─────────────────────────┤
│ 📍 Browse Available     │
│    Malls                │
│                         │
│ ┌─────┐  ┌─────┐       │
│ │Mall1│  │Mall2│       │
│ │     │  │     │       │
│ └──┬──┘  └─────┘       │
│    │                   │
└────┼───────────────────┘
     │ Select Mall
     ▼
┌─────────────────────────────────────────────┐
│ User Dashboard                              │
│ (/user/shops)                               │
├─────────────────────────────────────────────┤
│ 🏪 Shops in [Selected Mall]                 │
│                                             │
│ Filters:                                    │
│ 🔽 Floor: All ▾                             │
│ 🔽 Category: All ▾                          │
│                                             │
│ ┌──────┐  ┌──────┐  ┌──────┐              │
│ │Shop 1│  │Shop 2│  │Shop 3│              │
│ │Floor │  │Floor │  │Floor │              │
│ │  1   │  │  2   │  │  1   │              │
│ └──┬───┘  └──────┘  └──────┘              │
│    │                                        │
└────┼────────────────────────────────────────┘
     │ Click Shop
     ▼
┌─────────────────────────────────────────────┐
│ Products Page                               │
│ (/user/products)                            │
├─────────────────────────────────────────────┤
│ 🛍️ Products in [Mall Name]                  │
│                                             │
│ 🔍 Search: [___________]                    │
│                                             │
│ Filters:                                    │
│ 🔽 Shop: All ▾                              │
│ 🔽 Floor: All ▾                             │
│ 🔽 Category: All ▾                          │
│                                             │
│ ┌────────────┐  ┌────────────┐             │
│ │ Product 1  │  │ Product 2  │             │
│ │ [Image]    │  │ [Image]    │             │
│ │            │  │            │             │
│ │ Name       │  │ Name       │             │
│ │ ₹2,999     │  │ ₹4,999     │             │
│ │            │  │            │             │
│ │ ❤️ Save    │  │ 💚 Saved   │             │
│ │ ⚖️ Compare │  │ ⚖️ Compare │             │
│ └────────────┘  └────────────┘             │
│                                             │
└─────────────────┬───────────────────────────┘
                  │
      ┌───────────┼───────────┐
      │           │           │
      ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Click ❤️ │ │ Click ⚖️ │ │ Click    │
│ Save     │ │ Compare  │ │ Product  │
└────┬─────┘ └────┬─────┘ └────┬─────┘
     │            │            │
     ▼            ▼            ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Saved    │ │ Add to   │ │ Product  │
│ Items    │ │ Comparison│ │ Details  │
│ Page     │ │ List     │ │ (future) │
└──────────┘ │ (max 4)  │ └──────────┘
             └────┬─────┘
                  │
                  ▼
             ┌──────────┐
             │ Compare  │
             │ Page     │
             │ (/user/  │
             │ compare) │
             └──────────┘

Additional Navigation:
─────────────────────
• 🏷️ Offers → View active discounts
• 💾 Saved Items → View saved products
• ⚖️ Compare → Side-by-side comparison
• 👤 Account → Profile settings
```

---

## 4. Screen Wireframes

### 4.1 Public Pages

#### 4.1.1 Homepage (/)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────┐  [Super Mall]     Home  About  Contact  [Login]    │
│ │LOGO │                                          [Register] │
│ └─────┘                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              ┌───────────────────────┐                      │
│              │                       │                      │
│              │   HERO IMAGE / VIDEO  │                      │
│              │                       │                      │
│              │   Digital Mall        │                      │
│              │   Management System   │                      │
│              │                       │                      │
│              │  [Get Started] [Learn │                      │
│              │                More]   │                      │
│              └───────────────────────┘                      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✨ Key Features                                            │
│                                                             │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐              │
│  │ 👥 Admin  │  │ 🏪 Merchant│ │ 🛍️ User   │              │
│  │           │  │            │  │            │              │
│  │ Manage    │  │ Create     │  │ Browse &   │              │
│  │ Malls     │  │ Shops      │  │ Compare    │              │
│  │ Merchants │  │ Products   │  │ Products   │              │
│  │ Shops     │  │ Offers     │  │ Save Items │              │
│  └───────────┘  └───────────┘  └───────────┘              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📊 Statistics                                              │
│                                                             │
│  50+ Malls     200+ Merchants     5000+ Products            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                 Footer                                      │
│  © 2026 Super Mall | Terms | Privacy | Contact              │
└─────────────────────────────────────────────────────────────┘
```

#### 4.1.2 Login Page (/login)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────┐  [Super Mall]                         ← Back        │
│ │LOGO │                                                     │
│ └─────┘                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    ┌─────────────────┐                      │
│                    │   Login to      │                      │
│                    │   Super Mall    │                      │
│                    │                 │                      │
│                    │  📧 Email       │                      │
│                    │  [___________]  │                      │
│                    │                 │                      │
│                    │  🔒 Password    │                      │
│                    │  [___________]  │                      │
│                    │                 │                      │
│                    │  [ ] Remember   │                      │
│                    │      me         │                      │
│                    │                 │                      │
│                    │  [Login Button] │                      │
│                    │                 │                      │
│                    │  Forgot password│                      │
│                    │                 │                      │
│                    │  Don't have an  │                      │
│                    │  account?       │                      │
│                    │  Register here  │                      │
│                    └─────────────────┘                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 4.1.3 Register Page (/register)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────┐  [Super Mall]                         ← Back        │
│ │LOGO │                                                     │
│ └─────┘                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    ┌─────────────────┐                      │
│                    │ Create Account  │                      │
│                    │                 │                      │
│                    │  👤 Full Name   │                      │
│                    │  [___________]  │                      │
│                    │                 │                      │
│                    │  📧 Email       │                      │
│                    │  [___________]  │                      │
│                    │                 │                      │
│                    │  🔒 Password    │                      │
│                    │  [___________]  │                      │
│                    │                 │                      │
│                    │  🔒 Confirm     │                      │
│                    │     Password    │                      │
│                    │  [___________]  │                      │
│                    │                 │                      │
│                    │  🎭 Select Role │                      │
│                    │  ○ Admin        │                      │
│                    │  ○ Merchant     │                      │
│                    │  ● User         │                      │
│                    │                 │                      │
│                    │  [Register]     │                      │
│                    │                 │                      │
│                    │  Already have   │                      │
│                    │  account? Login │                      │
│                    └─────────────────┘                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.2 Admin Pages

#### 4.2.1 Admin Dashboard (/admin)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────┐  [Super Mall]   Dashboard  Malls  Merchants  Shops │
│ │LOGO │                                    [Admin] ▾        │
│ └─────┘                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Dashboard Overview                                         │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   🏢 Malls   │  │ 👥 Merchants │  │  🏪 Shops    │     │
│  │              │  │              │  │              │     │
│  │      42      │  │     156      │  │     892      │     │
│  │              │  │              │  │              │     │
│  │  [View All]  │  │  [View All]  │  │  [View All]  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  Quick Actions                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │ + Create   │  │ + Create   │  │ + Create   │           │
│  │   Mall     │  │   Merchant │  │   Shop     │           │
│  └────────────┘  └────────────┘  └────────────┘           │
│                                                             │
│  📊 Recent Activity                                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • New merchant registered: Fashion Hub               │  │
│  │ • Mall created: Phoenix Mall, Mumbai                 │  │
│  │ • Shop added: Electronics Store, Section A           │  │
│  │ • Merchant approved: Food Court Co.                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 4.2.2 Admin - Malls List (/admin/malls)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────┐  [Super Mall]   Dashboard  Malls  Merchants  Shops │
│ │LOGO │                                    [Admin] ▾        │
│ └─────┘                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Malls Management                     [+ Create New Mall]   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🔍 Search malls... [_______________]                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ [Image]         │  │ [Image]         │                  │
│  │                 │  │                 │                  │
│  │ Phoenix Mall    │  │ Central Plaza   │                  │
│  │ Mumbai, MH      │  │ Delhi, DL       │                  │
│  │                 │  │                 │                  │
│  │ 45 Shops        │  │ 38 Shops        │                  │
│  │                 │  │                 │                  │
│  │ [View] [Edit]   │  │ [View] [Edit]   │                  │
│  │ [Delete]        │  │ [Delete]        │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ [Image]         │  │ [Image]         │                  │
│  │                 │  │                 │                  │
│  │ Metro Junction  │  │ Grand Galleria  │                  │
│  │ Bangalore, KA   │  │ Pune, MH        │                  │
│  │                 │  │                 │                  │
│  │ 52 Shops        │  │ 29 Shops        │                  │
│  │                 │  │                 │                  │
│  │ [View] [Edit]   │  │ [View] [Edit]   │                  │
│  │ [Delete]        │  │ [Delete]        │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 4.2.3 Admin - Create Mall (/admin/malls/create)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────┐  [Super Mall] ← Back to Malls                       │
│ │LOGO │                                    [Admin] ▾        │
│ └─────┘                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Create New Mall                                            │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │  Mall Name *                                         │  │
│  │  [_____________________________________]             │  │
│  │                                                      │  │
│  │  Location *                                          │  │
│  │  [_____________________________________]             │  │
│  │  (e.g., Mumbai, Maharashtra)                         │  │
│  │                                                      │  │
│  │  Description                                         │  │
│  │  [_____________________________________]             │  │
│  │  [_____________________________________]             │  │
│  │  [_____________________________________]             │  │
│  │                                                      │  │
│  │  Mall Image *                                        │  │
│  │  ┌────────────────────┐                             │  │
│  │  │                    │                             │  │
│  │  │   [Upload Image]   │                             │  │
│  │  │                    │                             │  │
│  │  └────────────────────┘                             │  │
│  │  or drag and drop                                    │  │
│  │                                                      │  │
│  │  Preview:                                            │  │
│  │  [Image preview will appear here]                    │  │
│  │                                                      │  │
│  │                                                      │  │
│  │         [Cancel]             [Create Mall]           │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.3 Merchant Pages

#### 4.3.1 Merchant Dashboard (/merchant)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────┐  [Super Mall]  Dashboard  Shops  Products  Offers  │
│ │LOGO │                                    [Merchant] ▾     │
│ └─────┘                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Welcome, [Merchant Name]                                   │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  🏪 My Shops │  │ 📦 Products  │  │ 🏷️ Offers   │     │
│  │              │  │              │  │              │     │
│  │       8      │  │      156     │  │      12      │     │
│  │              │  │              │  │              │     │
│  │  [Manage]    │  │  [Manage]    │  │  [Manage]    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  Quick Actions                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │ + Create   │  │ + Add      │  │ + Create   │           │
│  │   Shop     │  │   Product  │  │   Offer    │           │
│  └────────────┘  └────────────┘  └────────────┘           │
│                                                             │
│  📊 My Shops                                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Shop Name          Mall            Products  [Action]│  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ Fashion Hub        Phoenix Mall    42        [Edit]  │  │
│  │ Electronics Plus   Central Plaza   38        [Edit]  │  │
│  │ Food Court         Metro Mall      28        [Edit]  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 4.3.2 Merchant - Products List (/merchant/products)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────┐  [Super Mall]  Dashboard  Shops  Products  Offers  │
│ │LOGO │                                    [Merchant] ▾     │
│ └─────┘                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  My Products                          [+ Add New Product]   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🔍 Search products... [_______________]              │  │
│  │ Filter by Shop: [All Shops ▾]                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  │
│  │ [Image]       │  │ [Image]       │  │ [Image]       │  │
│  │               │  │               │  │               │  │
│  │ Wireless      │  │ Denim Jacket  │  │ Smartphone X  │  │
│  │ Headphones    │  │               │  │               │  │
│  │               │  │               │  │               │  │
│  │ ₹2,999        │  │ ₹3,499        │  │ ₹24,999       │  │
│  │               │  │               │  │               │  │
│  │ Electronics   │  │ Fashion Hub   │  │ Electronics   │  │
│  │ Plus          │  │               │  │ Plus          │  │
│  │               │  │               │  │               │  │
│  │ [Edit]        │  │ [Edit]        │  │ [Edit]        │  │
│  │ [Delete]      │  │ [Delete]      │  │ [Delete]      │  │
│  └───────────────┘  └───────────────┘  └───────────────┘  │
│                                                             │
│  [1] [2] [3] ... [10]  (Pagination)                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 4.3.3 Merchant - Add Product (/merchant/products/add)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────┐  [Super Mall] ← Back to Products                    │
│ │LOGO │                                    [Merchant] ▾     │
│ └─────┘                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Add New Product                                            │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │  Select Shop *                                       │  │
│  │  [Select a shop ▾]                                   │  │
│  │                                                      │  │
│  │  Product Name *                                      │  │
│  │  [_____________________________________]             │  │
│  │                                                      │  │
│  │  Price (₹) *                                         │  │
│  │  [_____________________________________]             │  │
│  │                                                      │  │
│  │  Category *                                          │  │
│  │  [Select category ▾]                                 │  │
│  │  (Electronics, Fashion, Food, Home, etc.)            │  │
│  │                                                      │  │
│  │  Description *                                       │  │
│  │  [_____________________________________]             │  │
│  │  [_____________________________________]             │  │
│  │  [_____________________________________]             │  │
│  │                                                      │  │
│  │  Features                                            │  │
│  │  [_____________________________________]             │  │
│  │  (e.g., Bluetooth 5.0, 20hr battery)                 │  │
│  │                                                      │  │
│  │  Product Image *                                     │  │
│  │  ┌────────────────────┐                             │  │
│  │  │                    │                             │  │
│  │  │   [Upload Image]   │                             │  │
│  │  │                    │                             │  │
│  │  └────────────────────┘                             │  │
│  │                                                      │  │
│  │  Preview: [Image preview]                            │  │
│  │                                                      │  │
│  │                                                      │  │
│  │         [Cancel]             [Add Product]           │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.4 User Pages

#### 4.4.1 Mall Selection (/user/malls)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────┐  [Super Mall]   Malls  Shops  Products  Offers     │
│ │LOGO │                                        [User] ▾     │
│ └─────┘                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Select a Mall to Browse                                    │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🔍 Search malls... [_______________]                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ [Mall Image]    │  │ [Mall Image]    │                  │
│  │                 │  │                 │                  │
│  │ Phoenix Mall    │  │ Central Plaza   │                  │
│  │                 │  │                 │                  │
│  │ 📍 Mumbai, MH   │  │ 📍 Delhi, DL    │                  │
│  │                 │  │                 │                  │
│  │ 🏪 45 Shops     │  │ 🏪 38 Shops     │                  │
│  │                 │  │                 │                  │
│  │   [Browse →]    │  │   [Browse →]    │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ [Mall Image]    │  │ [Mall Image]    │                  │
│  │                 │  │                 │                  │
│  │ Metro Junction  │  │ Grand Galleria  │                  │
│  │                 │  │                 │                  │
│  │ 📍 Bangalore,KA │  │ 📍 Pune, MH     │                  │
│  │                 │  │                 │                  │
│  │ 🏪 52 Shops     │  │ 🏪 29 Shops     │                  │
│  │                 │  │                 │                  │
│  │   [Browse →]    │  │   [Browse →]    │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 4.4.2 User - Shops (/user/shops)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────┐  [Super Mall]   Malls  Shops  Products  Offers     │
│ │LOGO │                                        [User] ▾     │
│ └─────┘                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Shops in Phoenix Mall                         🏢 Change Mall│
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Filter by Floor: [All Floors ▾]                      │  │
│  │ Filter by Category: [All Categories ▾]               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ [Shop Image]    │  │ [Shop Image]    │                  │
│  │                 │  │                 │                  │
│  │ Fashion Hub     │  │ Electronics Plus│                  │
│  │                 │  │                 │                  │
│  │ 👕 Fashion      │  │ 🔌 Electronics  │                  │
│  │                 │  │                 │                  │
│  │ 📍 Ground Floor │  │ 📍 First Floor  │                  │
│  │    Section A    │  │    Section B    │                  │
│  │                 │  │                 │                  │
│  │ 42 Products     │  │ 38 Products     │                  │
│  │                 │  │                 │                  │
│  │  [View Shop]    │  │  [View Shop]    │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ [Shop Image]    │  │ [Shop Image]    │                  │
│  │                 │  │                 │                  │
│  │ Food Court      │  │ Home Decor      │                  │
│  │                 │  │                 │                  │
│  │ 🍕 Food         │  │ 🏠 Home & Living│                  │
│  │                 │  │                 │                  │
│  │ 📍 Second Floor │  │ 📍 First Floor  │                  │
│  │    Section C    │  │    Section A    │                  │
│  │                 │  │                 │                  │
│  │ 28 Products     │  │ 51 Products     │                  │
│  │                 │  │                 │                  │
│  │  [View Shop]    │  │  [View Shop]    │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 4.4.3 User - Products (/user/products)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────┐  [Super Mall]   Malls  Shops  Products  Offers     │
│ │LOGO │              🛍️ (2)  ⚖️ (3)            [User] ▾     │
│ └─────┘              Saved  Compare                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Products in Phoenix Mall                      🏢 Change Mall│
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🔍 Search products... [_______________]              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Shop: [All Shops ▾]  Floor: [All ▾]  Category: [All▾]│  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  156 products found                                         │
│                                                             │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  │
│  │ [Image]    ❤️ │  │ [Image]    💚 │  │ [Image]    ❤️ │  │
│  │               │  │               │  │               │  │
│  │ Wireless      │  │ Denim Jacket  │  │ Smartphone X  │  │
│  │ Headphones    │  │               │  │               │  │
│  │               │  │               │  │               │  │
│  │ ₹2,999        │  │ ₹3,499        │  │ ₹24,999       │  │
│  │               │  │               │  │               │  │
│  │ Bluetooth 5.0 │  │ Slim fit,     │  │ 6GB RAM,      │  │
│  │ 20hr battery  │  │ Classic style │  │ 128GB Storage │  │
│  │               │  │               │  │               │  │
│  │ Electronics   │  │ Fashion Hub   │  │ Electronics   │  │
│  │ Plus          │  │               │  │ Plus          │  │
│  │               │  │               │  │               │  │
│  │  ⚖️ Compare   │  │  ⚖️ Compare   │  │  ⚖️ Added     │  │
│  └───────────────┘  └───────────────┘  └───────────────┘  │
│                                                             │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  │
│  │ [Image]    ❤️ │  │ [Image]    ❤️ │  │ [Image]    ❤️ │  │
│  │               │  │               │  │               │  │
│  │ ...           │  │ ...           │  │ ...           │  │
│  └───────────────┘  └───────────────┘  └───────────────┘  │
│                                                             │
│  [1] [2] [3] ... [10]  (Pagination)                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 4.4.4 User - Compare Products (/user/compare)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────┐  [Super Mall]                                       │
│ │LOGO │              🛍️ (2) ⚖️ (3)            [User] ▾      │
│ └─────┘              Saved Compare                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Compare Products                     [Clear All]           │
│                                                             │
│  ┌──────────┬──────────┬──────────┬──────────┐             │
│  │          │ Product 1│ Product 2│ Product 3│             │
│  ├──────────┼──────────┼──────────┼──────────┤             │
│  │ Image    │ [Image]  │ [Image]  │ [Image]  │             │
│  │          │    ❌     │    ❌     │    ❌     │             │
│  ├──────────┼──────────┼──────────┼──────────┤             │
│  │ Name     │ Wireless │ Bluetooth│ Premium  │             │
│  │          │ Headphone│ Earbuds  │ Headset  │             │
│  ├──────────┼──────────┼──────────┼──────────┤             │
│  │ Price    │ ₹2,999 ✅│ ₹1,999   │ ₹4,999   │             │
│  │          │ Best Deal│          │          │             │
│  ├──────────┼──────────┼──────────┼──────────┤             │
│  │ Features │ BT 5.0   │ BT 4.2   │ BT 5.2   │             │
│  │          │ 20hr     │ 12hr     │ 30hr     │             │
│  │          │ ANC      │ No ANC   │ ANC Pro  │             │
│  ├──────────┼──────────┼──────────┼──────────┤             │
│  │ Shop     │ Electron.│ Electron.│ Fashion  │             │
│  │          │ Plus     │ Plus     │ Hub      │             │
│  ├──────────┼──────────┼──────────┼──────────┤             │
│  │ Category │ Electron.│ Electron.│ Electron.│             │
│  ├──────────┼──────────┼──────────┼──────────┤             │
│  │ Action   │ ❤️ Save  │ ❤️ Save  │ 💚 Saved │             │
│  │          │ [Remove] │ [Remove] │ [Remove] │             │
│  └──────────┴──────────┴──────────┴──────────┘             │
│                                                             │
│  💡 Tip: Add up to 4 products to compare                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 4.4.5 User - Saved Items (/user/saved)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────┐  [Super Mall]   Malls  Shops  Products  Offers     │
│ │LOGO │              🛍️ (8)  ⚖️ (0)            [User] ▾     │
│ └─────┘              Saved  Compare                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  My Saved Items                                             │
│                                                             │
│  8 items saved                                              │
│                                                             │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  │
│  │ [Image]    💚 │  │ [Image]    💚 │  │ [Image]    💚 │  │
│  │               │  │               │  │               │  │
│  │ Wireless      │  │ Denim Jacket  │  │ Smartphone X  │  │
│  │ Headphones    │  │               │  │               │  │
│  │               │  │               │  │               │  │
│  │ ₹2,999        │  │ ₹3,499        │  │ ₹24,999       │  │
│  │               │  │               │  │               │  │
│  │ Electronics   │  │ Fashion Hub   │  │ Electronics   │  │
│  │ Plus          │  │               │  │ Plus          │  │
│  │               │  │               │  │               │  │
│  │  ⚖️ Compare   │  │  ⚖️ Compare   │  │  ⚖️ Compare   │  │
│  │  🗑️ Remove    │  │  🗑️ Remove    │  │  🗑️ Remove    │  │
│  └───────────────┘  └───────────────┘  └───────────────┘  │
│                                                             │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  │
│  │ ...           │  │ ...           │  │ ...           │  │
│  └───────────────┘  └───────────────┘  └───────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Component Library

### 5.1 Reusable Components

#### Button Component
```
Primary Button:   [Submit]
Secondary Button: [Cancel]
Icon Button:      [🗑️]
Link Button:      Login here
```

#### Card Component
```
┌─────────────────┐
│ [Header]        │
├─────────────────┤
│ Content area    │
│                 │
├─────────────────┤
│ [Footer/Actions]│
└─────────────────┘
```

#### Input Fields
```
Text Input:
  Label
  [________________]
  Helper text

Select Dropdown:
  Label
  [Select option ▾]

File Upload:
  ┌────────────┐
  │ [📎 Upload]│
  └────────────┘
```

#### Filters
```
┌────────────────────────────┐
│ 🔍 Search: [__________]    │
│                            │
│ Category: [All ▾]          │
│ Floor: [All ▾]             │
│ Shop: [All ▾]              │
│                            │
│ [Clear Filters]            │
└────────────────────────────┘
```

---

## 6. Responsive Design

### 6.1 Breakpoints

```
Mobile (Portrait):  320px - 480px
Mobile (Landscape): 481px - 768px
Tablet (Portrait):  769px - 1024px
Desktop:            1025px - 1920px
Large Desktop:      1921px+
```

### 6.2 Mobile Adaptations

**Desktop Navigation:**
```
┌────────────────────────────────────────────┐
│ Logo  Home  Shops  Products  Offers  Login │
└────────────────────────────────────────────┘
```

**Mobile Navigation (Bottom Bar):**
```
┌────────────────────────────────────────────┐
│                                            │
│         (Main Content Area)                │
│                                            │
├────────────────────────────────────────────┤
│  🏠     🏪     🛍️      🏷️      👤         │
│ Home  Shops Products Offers  Account       │
└────────────────────────────────────────────┘
```

---

## 7. Color Palette

```
Primary Colors:
───────────────
Primary: #4F46E5 (Indigo)
  ■ Used for: Buttons, Links, Active states

Secondary: #10B981 (Green)
  ■ Used for: Success messages, Saved items

Accent: #F59E0B (Amber)
  ■ Used for: Offers, Discounts, Highlights


Neutral Colors:
───────────────
Gray-50:  #F9FAFB ■ Backgrounds
Gray-200: #E5E7EB ■ Borders
Gray-600: #4B5563 ■ Text (secondary)
Gray-900: #111827 ■ Text (primary)


Status Colors:
──────────────
Success: #10B981 ■ (Green)
Warning: #F59E0B ■ (Amber)
Error:   #EF4444 ■ (Red)
Info:    #3B82F6 ■ (Blue)
```

---

## 8. Typography

```
Font Family:
────────────
System Font Stack:
-apple-system, BlinkMacSystemFont, 'Segoe UI', 
'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 
'Fira Sans', 'Droid Sans', 'Helvetica Neue'


Font Sizes:
───────────
H1: 36px / 2.25rem  (Page titles)
H2: 30px / 1.875rem (Section headers)
H3: 24px / 1.5rem   (Card titles)
H4: 20px / 1.25rem  (Subsections)
Body: 16px / 1rem   (Normal text)
Small: 14px / 0.875rem (Caption, labels)


Font Weights:
─────────────
Light:   300
Regular: 400
Medium:  500
Bold:    700
```

---

## 9. Iconography

```
Icon Library: Lucide React
Icon Size: 20px - 24px (standard)

Common Icons:
─────────────
🏪 Shop       ShoppingBag
🛍️ Products   Package
🏷️ Offers     Tag
💾 Save       Heart
⚖️ Compare    Scale
🔍 Search     Search
⚙️ Settings   Settings
👤 User       User
🚪 Logout     LogOut
✏️ Edit       Edit
🗑️ Delete     Trash2
➕ Add        Plus
❌ Remove     X
✅ Confirm    Check
```

---

## 10. Accessibility

### 10.1 ARIA Labels

```html
<!-- Buttons -->
<button aria-label="Save product">❤️</button>
<button aria-label="Add to comparison">⚖️</button>

<!-- Navigation -->
<nav aria-label="Main navigation">...</nav>

<!-- Forms -->
<input aria-label="Search products" />
<select aria-label="Filter by category">...</select>
```

### 10.2 Keyboard Navigation

```
Tab: Navigate through interactive elements
Enter: Activate buttons/links
Esc: Close modals/dropdowns
Arrow keys: Navigate dropdowns
Space: Toggle checkboxes
```

### 10.3 Color Contrast

```
Text on Background:
───────────────────
Normal Text: 4.5:1 (WCAG AA)
Large Text: 3:1 (WCAG AA)

Examples:
#111827 on #FFFFFF ✅ 15.9:1
#4F46E5 on #FFFFFF ✅ 8.6:1
#10B981 on #FFFFFF ✅ 3.4:1 (large text only)
```

---

## 11. Conclusion

This wireframe documentation provides a complete visual and functional specification for the Super Mall Web Application. It covers:

✅ All user roles (Admin, Merchant, User)  
✅ Complete user journeys  
✅ Detailed screen wireframes  
✅ Component specifications  
✅ Responsive design patterns  
✅ Design system (colors, typography, icons)  
✅ Accessibility guidelines  

**Implementation Notes:**
- Use component-based approach (React)
- Follow mobile-first responsive design
- Ensure WCAG 2.1 AA compliance
- Maintain consistent design language
- Test across devices and browsers

---

**Document Version:** 1.0  
**Last Updated:** March 2026  
**Status:** Approved ✅  
**Figma/Design Tool:** TBD (wireframes to be created)
