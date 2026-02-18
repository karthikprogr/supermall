# 🛒 Super Mall Web Application

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-10.x-orange.svg)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **UM Internship Project | Full Stack JavaScript (MERN Stack) | 12-24 Weeks**

A comprehensive multi-shop e-commerce platform that enables merchants to manage shops, products, and offers while allowing customers to browse, compare, and discover products efficiently.

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Firebase Configuration](#-firebase-configuration)
- [Usage](#-usage)
- [User Roles](#-user-roles)
- [Database Schema](#-database-schema)
- [Security](#-security)
- [Screenshots](#-screenshots)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Problem Statement

Small and rural merchants struggle to showcase their products digitally and reach customers globally. There is no centralized platform to manage multiple shops, offers, categories, and locations in a single mall-style system.

**Key Challenges:**
- Limited digital presence for small merchants
- No unified platform for product showcase
- Difficulty in reaching global customers
- Lack of efficient product comparison tools
- No centralized offer management system

---

## ✅ Solution

The **Super Mall Web Application** is a cloud-based platform that:

✔️ Enables merchants to create and manage digital shops  
✔️ Provides product management with image uploads  
✔️ Offers a centralized offer management system  
✔️ Allows customers to browse, filter, and compare products  
✔️ Implements role-based access control (Admin, Merchant, User)  
✔️ Ensures security with Firebase Authentication  
✔️ Provides real-time data synchronization with Firestore  

---

## 🌟 Features

### 🔐 Authentication & Authorization
- Email/password authentication via Firebase
- Role-based access control (Admin, Merchant, User)
- Protected routes based on user roles
- Secure session management

### 👤 Admin Module
- View system statistics (shops, products, offers)
- Manage categories and floors
- View all shops across the platform
- System-wide control and monitoring
- Action logging for audit trails

### 🏪 Merchant Module
- Create and manage shops
- Add products with image uploads
- Create time-bound offers
- View merchant-specific dashboard
- Track shop and product statistics

### 🛍️ User Module
- Browse all available shops
- Filter shops by category and floor
- View products with detailed information
- Compare up to 4 products simultaneously
- Discover active offers and deals
- Advanced search functionality

### 📊 Additional Features
- Responsive design (Desktop, Tablet, Mobile)
- Real-time data updates
- Image upload to Firebase Storage
- Input validation and error handling
- Comprehensive action logging
- Clean and intuitive UI/UX

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **CSS3** - Styling

### Backend (Serverless)
- **Firebase Authentication** - User authentication
- **Firebase Firestore** - NoSQL database
- **Firebase Storage** - Image storage
- **Firebase Hosting** - Deployment (optional)

### Tools & Libraries
- **ES6+** - Modern JavaScript
- **Firebase SDK** - Firebase integration

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              React Frontend (Vite)              │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Admin   │  │ Merchant │  │   User   │     │
│  │ Module   │  │  Module  │  │  Module  │     │
│  └──────────┘  └──────────┘  └──────────┘     │
│                                                 │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│          Firebase Authentication                │
│                                                 │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│    Firebase Firestore (Database)                │
│                                                 │
│  ┌──────┐  ┌─────────┐  ┌────────┐  ┌────────┐│
│  │Users │  │  Shops  │  │Products│  │ Offers ││
│  └──────┘  └─────────┘  └────────┘  └────────┘│
│                                                 │
│  ┌──────────┐  ┌────────┐  ┌─────────┐        │
│  │Categories│  │ Floors │  │  Logs   │        │
│  └──────────┘  └────────┘  └─────────┘        │
│                                                 │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│      Firebase Storage (Images)                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
super_mall/
├── public/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── ShopCard.jsx
│   │   ├── ProductCard.jsx
│   │   ├── Filters.jsx
│   │   └── CompareModal.jsx
│   │
│   ├── contexts/            # React contexts
│   │   └── AuthContext.jsx
│   │
│   ├── pages/               # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   │
│   │   ├── admin/           # Admin pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── AdminShops.jsx
│   │   │
│   │   ├── merchant/        # Merchant pages
│   │   │   ├── MerchantDashboard.jsx
│   │   │   ├── MerchantShops.jsx
│   │   │   ├── CreateShop.jsx
│   │   │   ├── MerchantProducts.jsx
│   │   │   ├── AddProduct.jsx
│   │   │   └── CreateOffer.jsx
│   │   │
│   │   └── user/            # User pages
│   │       ├── UserDashboard.jsx
│   │       ├── UserShops.jsx
│   │       ├── UserProducts.jsx
│   │       └── UserOffers.jsx
│   │
│   ├── utils/               # Utility functions
│   │   ├── logger.js
│   │   └── validation.js
│   │
│   ├── firebase.js          # Firebase configuration
│   ├── App.jsx              # Main app component
│   ├── App.css              # Global styles
│   ├── main.jsx             # Entry point
│   └── index.css            # Base styles
│
├── .gitignore
├── package.json
├── vite.config.js
├── FIREBASE_SETUP.md        # Firebase setup guide
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/super-mall.git
cd super-mall
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Firebase Configuration

Follow the detailed instructions in [FIREBASE_SETUP.md](FIREBASE_SETUP.md) to:

1. Create a Firebase project
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Enable Firebase Storage
5. Get your Firebase configuration
6. Update `src/firebase.js` with your config

### Step 4: Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Step 5: Build for Production

```bash
npm run build
```

---

## 🔧 Firebase Configuration

Replace the placeholder values in `src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

**Important:** See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for complete setup instructions including security rules.

---

## 📖 Usage

### Creating Your First Admin Account

1. Start the application: `npm run dev`
2. Register a new account
3. Go to Firebase Console → Firestore Database
4. Find your user document in the `users` collection
5. Edit the document and change `role` from `user` to `admin`
6. Log out and log back in

### Demo Credentials (After Setup)

Create these demo accounts for testing:

- **Admin:** seelamkarthik2006@gmail.com / admin123
- **Merchant:** zudio2@gmail.com / zudio21
- **User:** user@supermall.com / user123

---

## 👥 User Roles

### 🔴 Admin
**Capabilities:**
- Manage categories and floors
- View all shops on the platform
- View system-wide statistics
- Access admin dashboard
- Full system control

**Routes:**
- `/admin` - Dashboard
- `/admin/shops` - View all shops
- `/admin/categories` - Manage categories
- `/admin/floors` - Manage floors

### 🟠 Merchant (Shop Owner)
**Capabilities:**
- Create and manage shops
- Add/update/delete products
- Upload product images
- Create time-bound offers
- View merchant-specific statistics

**Routes:**
- `/merchant` - Dashboard
- `/merchant/shops` - My shops
- `/merchant/shops/create` - Create shop
- `/merchant/products` - My products
- `/merchant/products/add` - Add product
- `/merchant/offers/create` - Create offer

### 🟢 User (Customer)
**Capabilities:**
- Browse all shops
- Filter by category and floor
- Search shops and products
- Compare products (up to 4)
- View active offers
- Discover deals

**Routes:**
- `/user` - Dashboard
- `/user/shops` - Browse shops
- `/user/products` - Browse products
- `/user/offers` - View offers

---

## 🗄️ Database Schema

### Collections

#### `users`
```javascript
{
  userId: "auto-generated",
  name: "string",
  email: "string",
  role: "admin | merchant | user",
  createdAt: "ISO date string"
}
```

#### `shops`
```javascript
{
  shopId: "auto-generated",
  shopName: "string",
  category: "string",
  floor: "string",
  description: "string",
  contactNumber: "string",
  ownerId: "userId reference",
  createdAt: "ISO date string"
}
```

#### `products`
```javascript
{
  productId: "auto-generated",
  name: "string",
  price: number,
  features: "string",
  imageURL: "string",
  shopId: "shopId reference",
  ownerId: "userId reference",
  createdAt: "ISO date string"
}
```

#### `offers`
```javascript
{
  offerId: "auto-generated",
  productId: "productId reference",
  discount: number,
  validTill: "date string",
  description: "string",
  ownerId: "userId reference",
  createdAt: "ISO date string"
}
```

#### `categories`
```javascript
{
  categoryId: "auto-generated",
  name: "string",
  createdAt: "ISO date string"
}
```

#### `floors`
```javascript
{
  floorId: "auto-generated",
  name: "string",
  createdAt: "ISO date string"
}
```

#### `logs`
```javascript
{
  logId: "auto-generated",
  userId: "userId reference",
  action: "string",
  description: "string",
  metadata: object,
  timestamp: "server timestamp",
  createdAt: "ISO date string"
}
```

---

## 🔒 Security

### Authentication
- Firebase Authentication with email/password
- Protected routes using React Router
- Role-based access control

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Admin-only collections
    match /categories/{categoryId} {
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /floors/{floorId} {
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Storage Security Rules
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

**See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for complete security rules.**

---

## 📸 Screenshots

### Home Page
![Home Page](screenshots/home.png)
*Landing page with feature overview*

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)
*Admin control panel with system statistics*

### Merchant Dashboard
![Merchant Dashboard](screenshots/merchant-dashboard.png)
*Merchant shop and product management*

### User Product Browse
![Product Browse](screenshots/user-products.png)
*Product browsing with filters and comparison*

### Product Comparison
![Compare Modal](screenshots/compare.png)
*Side-by-side product comparison*

---

## 🚀 Future Enhancements

- [ ] Real-time chat between merchants and customers
- [ ] Shopping cart and checkout functionality
- [ ] Payment gateway integration
- [ ] Order management system
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Social media integration
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] PWA support

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- UM Internship Program
- Firebase Team
- React Community
- Vite Team

---

## 📞 Support

For support, email your.email@example.com or create an issue in the repository.

---

## 🎓 Project Context

This project was developed as part of the **UM Internship Program** for **Full Stack JavaScript (MEAN/MERN) Development** (12-24 weeks). It demonstrates:

- Full-stack development skills
- React.js proficiency
- Firebase integration
- Real-world business logic
- Clean code architecture
- Responsive design
- Security best practices
- Role-based access control
- State management
- Cloud deployment readiness

---

**Made with ❤️ for UM Internship Program**
