# 🔍 Low Level Design (LLD) Document
## Super Mall Web Application

**Project:** Super Mall Management System  
**Version:** 1.0  
**Date:** March 2026  
**Author:** Karthik  

---

## 📑 Table of Contents

1. [Introduction](#introduction)
2. [Component Architecture](#component-architecture)
3. [Data Flow Diagrams](#data-flow-diagrams)
4. [Component Specifications](#component-specifications)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Database Operations](#database-operations)
8. [Routing Structure](#routing-structure)
9. [Error Handling](#error-handling)
10. [Performance Optimization](#performance-optimization)

---

## 1. Introduction

### 1.1 Purpose
This document provides detailed low-level design specifications for the Super Mall Web Application, covering component structures, data flows, and implementation details.

### 1.2 Scope
- React component architecture
- Firebase integration patterns
- State management with Context API
- Routing and navigation flows
- Form validation and error handling

### 1.3 Technologies
- **Frontend:** React 18.3.1, React Router DOM 7.1.1
- **Build Tool:** Vite 6.0.5
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Styling:** CSS3 with custom properties
- **Image Management:** Cloudinary CDN

---

## 2. Component Architecture

### 2.1 Component Hierarchy

```
App
├── Navbar
│   └── UserDropdownMenu
├── MobileBottomNav
├── Routes
│   ├── ProtectedRoute
│   ├── PublicRoute
│   └── RoleBasedRoute
├── Pages
│   ├── Auth
│   │   ├── Login
│   │   ├── Register
│   │   └── Home
│   ├── Admin
│   │   ├── AdminDashboard
│   │   ├── AdminMalls (CRUD)
│   │   ├── AdminMerchants (CRUD)
│   │   └── AdminShops (CRUD)
│   ├── Merchant
│   │   ├── MerchantDashboard
│   │   ├── MerchantShops (CRUD)
│   │   ├── MerchantProducts (CRUD)
│   │   └── CreateOffer
│   └── User
│       ├── MallSelection
│       ├── UserShops
│       ├── UserProducts
│       ├── UserOffers
│       ├── UserSavedItems
│       ├── UserCompare
│       ├── UserAccount
│       └── HelpSupport
└── Contexts
    ├── AuthContext
    └── UserContext
```

### 2.2 Component Types

#### Presentational Components
```javascript
// ProductCard.jsx
const ProductCard = ({ product, showSaveButton = true }) => {
  // Pure UI component
  // Props: product object, showSaveButton flag
  // Emits: onSave, onCompare events
}

// ShopCard.jsx
const ShopCard = ({ shop, onViewDetails }) => {
  // Displays shop information
  // Props: shop object, click handler
}

// Filters.jsx
const Filters = ({ onFilterChange, mallId }) => {
  // Filter controls for products/shops
  // Props: filter callback, selected mall
}
```

#### Container Components
```javascript
// UserProducts.jsx
const UserProducts = () => {
  // Fetches and manages product data
  // Handles filtering, searching, comparison
  // Uses: AuthContext, UserContext, Firestore
}

// AdminMalls.jsx
const AdminMalls = () => {
  // Manages mall CRUD operations
  // Admin-only access
  // Uses: AuthContext, Firestore, Cloudinary
}
```

#### HOC Components
```javascript
// ProtectedRoute.jsx
const ProtectedRoute = ({ children, requiredRole }) => {
  // Wraps routes requiring authentication
  // Checks user role
  // Redirects unauthorized users
}
```

---

## 3. Data Flow Diagrams

### 3.1 Authentication Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │ Login/Register
       ▼
┌─────────────────┐
│  Login Page     │
│  - Email        │
│  - Password     │
└────────┬────────┘
         │ Submit
         ▼
┌─────────────────┐
│ Firebase Auth   │
│ - Authenticate  │
│ - Create Token  │
└────────┬────────┘
         │ Success
         ▼
┌─────────────────┐
│ Firestore Query │
│ Get user role   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  AuthContext Update     │
│  - currentUser          │
│  - userRole             │
│  - userName             │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Role-Based Redirect    │
│  - Admin → /admin       │
│  - Merchant → /merchant │
│  - User → /user/malls   │
└─────────────────────────┘
```

### 3.2 Product Creation Flow (Merchant)

```
┌──────────────┐
│  Merchant    │
└──────┬───────┘
       │ Click "Add Product"
       ▼
┌─────────────────┐
│  AddProduct.jsx │
│  - Form Fields  │
│  - Image Upload │
└────────┬────────┘
         │ Select Image
         ▼
┌─────────────────┐
│   Cloudinary    │
│   Upload API    │
└────────┬────────┘
         │ Return imageURL
         ▼
┌─────────────────┐
│  Form Submit    │
│  - Validate     │
│  - Prepare Data │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│  Firestore Add Doc  │
│  Collection: products│
│  - name, price, etc  │
│  - imageURL         │
│  - merchantId       │
└────────┬────────────┘
         │ Success
         ▼
┌─────────────────┐
│  Logger.js      │
│  logProduct.add │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Redirect to    │
│  Products List  │
└─────────────────┘
```

### 3.3 User Save Product Flow

```
┌──────────────┐
│     User     │
└──────┬───────┘
       │ Click Save Icon
       ▼
┌─────────────────────┐
│  ProductCard.jsx    │
│  onClick Handler    │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  UserContext        │
│  toggleSavedItem()  │
└────────┬────────────┘
         │
    ┌────┴────┐
    │ Check   │
    │ Status  │
    └────┬────┘
         │
    ┌────▼─────────┐
    │  Is Saved?   │
    └──┬───────┬───┘
       │ Yes   │ No
       │       │
       ▼       ▼
    Remove   Add to
    from     savedItems[]
    array
       │       │
       └───┬───┘
           ▼
┌─────────────────────┐
│  Firestore Update   │
│  users/{userId}     │
│  savedItems: []     │
└────────┬────────────┘
         │
         ▼
┌─────────────────┐
│  Logger.js      │
│  logUser.save/  │
│  unsave         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  UI Update      │
│  Toggle Heart   │
│  Icon Color     │
└─────────────────┘
```

---

## 4. Component Specifications

### 4.1 AuthContext

**File:** `src/contexts/AuthContext.jsx`

**Purpose:** Manage authentication state globally

**State Variables:**
```javascript
{
  currentUser: Object | null,
  userRole: 'admin' | 'merchant' | 'user' | null,
  userName: String | null,
  loading: Boolean
}
```

**Methods:**
```javascript
// Login with email and password
login(email, password) => Promise<{success, error}>

// Register new user
register(email, password, displayName, role) => Promise<{success, error}>

// Logout current user
logout() => Promise<{success, error}>

// Reset password
resetPassword(email) => Promise<{success, error}>
```

**Firebase Integration:**
```javascript
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const role = userDoc.data()?.role;
      setUserRole(role);
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
      setUserRole(null);
    }
    setLoading(false);
  });
  return unsubscribe;
}, []);
```

### 4.2 UserContext

**File:** `src/contexts/UserContext.jsx`

**Purpose:** Manage user-specific data and preferences

**State Variables:**
```javascript
{
  selectedMall: {
    id: String,
    name: String,
    location: String
  } | null,
  savedItems: Array<productId>,
  comparisonList: Array<productId> (max 4)
}
```

**Methods:**
```javascript
// Set selected mall
setSelectedMall(mall) => void

// Toggle product in saved items
toggleSavedItem(productId) => Promise<void>

// Check if product is saved
isSaved(productId) => Boolean

// Add product to comparison
addToComparison(productId) => void

// Remove from comparison
removeFromComparison(productId) => void

// Clear all comparisons
clearComparison() => void
```

**Firestore Sync:**
```javascript
// Load saved items on user login
useEffect(() => {
  if (currentUser) {
    const unsubscribe = onSnapshot(
      doc(db, 'users', currentUser.uid),
      (snapshot) => {
        const data = snapshot.data();
        setSavedItems(data?.savedItems || []);
      }
    );
    return unsubscribe;
  }
}, [currentUser]);
```

### 4.3 ProductCard Component

**File:** `src/components/ProductCard.jsx`

**Props Interface:**
```javascript
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageURL: string;
    description: string;
    features: string;
    shopId: string;
    category: string;
  };
  showSaveButton?: boolean;
  showCompareButton?: boolean;
  inComparison?: boolean;
}
```

**Component Structure:**
```javascript
const ProductCard = ({ 
  product, 
  showSaveButton = true,
  showCompareButton = false,
  inComparison = false  
}) => {
  const { currentUser } = useAuth();
  const { toggleSavedItem, isSaved } = useUserContext();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isSaved(product.id));
  }, [product.id]);

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!currentUser) {
      alert('Please login to save items');
      return;
    }
    await toggleSavedItem(product.id);
    setSaved(!saved);
  };

  return (
    <div className="card product-card">
      {/* Save button */}
      {showSaveButton && currentUser && (
        <button 
          className={`btn-save-product ${saved ? 'saved' : ''}`}
          onClick={handleSave}
        >
          {/* SVG Icon */}
        </button>
      )}
      
      {/* Product image */}
      <div className="product-image">
        <img src={product.imageURL} alt={product.name} />
      </div>
      
      {/* Product details */}
      <div className="card-body">
        <h3>{product.name}</h3>
        <p className="product-price">₹{product.price}</p>
        <p className="product-features">{product.features}</p>
      </div>
    </div>
  );
};
```

**Event Handlers:**
- `handleSave()` - Toggle save state
- `handleCompare()` - Add to comparison list
- `onClick()` - Navigate to product details

### 4.4 Filters Component

**File:** `src/components/Filters.jsx`

**Props Interface:**
```javascript
interface FiltersProps {
  mallId: string;
  onFilterChange: (filters: FilterState) => void;
  showShopFilter?: boolean;
  showFloorFilter?: boolean;
  showCategoryFilter?: boolean;
}

interface FilterState {
  shopId: string | '';
  floor: string | '';
  category: string | '';
  searchTerm: string;
}
```

**State Management:**
```javascript
const [shops, setShops] = useState([]);
const [filters, setFilters] = useState({
  shopId: '',
  floor: '',
  category: '',
  searchTerm: ''
});

// Fetch shops based on mallId
useEffect(() => {
  const fetchShops = async () => {
    const q = query(
      collection(db, 'shops'),
      where('mallId', '==', mallId)
    );
    const snapshot = await getDocs(q);
    setShops(snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })));
  };
  if (mallId) fetchShops();
}, [mallId]);

// Notify parent on filter change
useEffect(() => {
  onFilterChange(filters);
}, [filters]);
```

---

## 5. State Management

### 5.1 Global State (Context API)

**AuthContext State:**
```javascript
{
  currentUser: {
    uid: "abc123",
    email: "user@example.com",
    displayName: "John Doe",
    photoURL: null
  },
  userRole: "user",
  userName: "John Doe",
  loading: false
}
```

**UserContext State:**
```javascript
{
  selectedMall: {
    id: "mall_001",
    name: "Phoenix Mall",
    location: "Mumbai"
  },
  savedItems: ["prod_001", "prod_002", "prod_003"],
  comparisonList: ["prod_001", "prod_004"]
}
```

### 5.2 Local State Management

**Component-Level useState:**
```javascript
// In UserProducts.jsx
const [products, setProducts] = useState([]);
const [filteredProducts, setFilteredProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [filters, setFilters] = useState({
  shopId: '',
  floor: '',
  category: '',
  searchTerm: ''
});
```

**Derived State:**
```javascript
// Filter products based on filters
useEffect(() => {
  let result = products;
  
  if (filters.shopId) {
    result = result.filter(p => p.shopId === filters.shopId);
  }
  
  if (filters.floor) {
    // Join with shops to get floor
    result = result.filter(p => {
      const shop = shops.find(s => s.id === p.shopId);
      return shop?.floor === filters.floor;
    });
  }
  
  if (filters.category) {
    result = result.filter(p => p.category === filters.category);
  }
  
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    result = result.filter(p => 
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    );
  }
  
  setFilteredProducts(result);
}, [products, filters, shops]);
```

---

## 6. API Integration

### 6.1 Firebase Firestore Operations

**Create Document:**
```javascript
// Add new product
const createProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: serverTimestamp(),
      merchantId: currentUser.uid
    });
    
    // Log action
    await logProduct.add(
      currentUser.uid,
      productData.name,
      docRef.id,
      productData.shopId
    );
    
    return { success: true, id: docRef.id };
  } catch (error) {
    await logError.firebaseError(
      currentUser.uid,
      'createProduct',
      error.code
    );
    return { success: false, error: error.message };
  }
};
```

**Read Documents:**
```javascript
// Fetch products by mall
const fetchProductsByMall = async (mallId) => {
  const startTime = Date.now();
  
  const q = query(
    collection(db, 'products'),
    where('mallId', '==', mallId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  const products = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  const fetchTime = Date.now() - startTime;
  await logPerformance.dataFetch(
    currentUser?.uid,
    'products',
    products.length,
    fetchTime
  );
  
  return products;
};
```

**Update Document:**
```javascript
// Update shop details
const updateShop = async (shopId, updates) => {
  try {
    await updateDoc(doc(db, 'shops', shopId), {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    await logShop.update(
      currentUser.uid,
      updates.shopName,
      shopId
    );
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

**Delete Document:**
```javascript
// Delete product
const deleteProduct = async (productId, productName) => {
  try {
    await deleteDoc(doc(db, 'products', productId));
    
    await logProduct.delete(
      currentUser.uid,
      productName,
      productId
    );
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

### 6.2 Cloudinary Integration

**Upload Image:**
```javascript
// Upload to Cloudinary
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  );

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      formData
    );
    
    return { 
      success: true, 
      url: response.data.secure_url 
    };
  } catch (error) {
    await logError.uploadError(
      currentUser.uid,
      file.name,
      error.message
    );
    return { success: false, error: error.message };
  }
};
```

---

## 7. Database Operations

### 7.1 Firestore Collections

**users**
```javascript
{
  uid: "user_123", // Document ID
  email: "user@example.com",
  displayName: "John Doe",
  role: "user", // admin | merchant | user
  photoURL: null,
  savedItems: ["prod_001", "prod_002"],
  createdAt: Timestamp,
  lastLogin: Timestamp
}
```

**malls**
```javascript
{
  id: "mall_001", // Auto-generated
  mallName: "Phoenix Mall",
  location: "Mumbai, Maharashtra",
  description: "Premium shopping destination",
  imageURL: "https://cloudinary.../mall.jpg",
  createdBy: "admin_uid",
  createdAt: Timestamp
}
```

**shops**
```javascript
{
  id: "shop_001",
  shopName: "Fashion Hub",
  description: "Trendy clothing store",
  category: "Fashion",
  floor: "Ground Floor",
  location: "Section A",
  mallId: "mall_001",
  merchantId: "merchant_uid",
  imageURL: "https://cloudinary.../shop.jpg",
  createdAt: Timestamp
}
```

**products**
```javascript
{
  id: "prod_001",
  name: "Wireless Headphones",
  price: 2999,
  description: "High-quality audio...",
  features: "Bluetooth 5.0, 20hr battery",
  category: "Electronics",
  shopId: "shop_001",
  mallId: "mall_001",
  merchantId: "merchant_uid",
  imageURL: "https://cloudinary.../product.jpg",
  createdAt: Timestamp
}
```

**offers**
```javascript
{
  id: "offer_001",
  discount: 25, // percentage
  description: "Festival Sale",
  validUntil: Timestamp,
  productId: "prod_001",
  shopId: "shop_001",
  merchantId: "merchant_uid",
  createdAt: Timestamp
}
```

**logs**
```javascript
{
  id: "log_001",
  userId: "user_123",
  action: "PRODUCT_SAVE",
  description: "Saved product: Wireless Headphones",
  metadata: {
    productId: "prod_001"
  },
  timestamp: ServerTimestamp,
  createdAt: ISOString
}
```

### 7.2 Query Patterns

**Get products with offers:**
```javascript
const getProductsWithOffers = async (mallId) => {
  // Step 1: Get products
  const productsQuery = query(
    collection(db, 'products'),
    where('mallId', '==', mallId)
  );
  const productsSnapshot = await getDocs(productsQuery);
  const products = productsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  // Step 2: Get all active offers
  const offersQuery = query(
    collection(db, 'offers'),
    where('validUntil', '>=', new Date())
  );
  const offersSnapshot = await getDocs(offersQuery);
  const offers = {};
  
  offersSnapshot.docs.forEach(doc => {
    const data = doc.data();
    offers[data.productId] = { id: doc.id, ...data };
  });

  // Step 3: Merge products with offers
  return products.map(product => ({
    ...product,
    offer: offers[product.id] || null
  }));
};
```

**Get shops with product count:**
```javascript
const getShopsWithProductCount = async (mallId) => {
  const shops = await getDocs(
    query(collection(db, 'shops'), where('mallId', '==', mallId))
  );
  
  const shopsWithCount = await Promise.all(
    shops.docs.map(async (shopDoc) => {
      const productsCount = await getCountFromServer(
        query(
          collection(db, 'products'),
          where('shopId', '==', shopDoc.id)
        )
      );
      
      return {
        id: shopDoc.id,
        ...shopDoc.data(),
        productCount: productsCount.data().count
      };
    })
  );
  
  return shopsWithCount;
};
```

---

## 8. Routing Structure

### 8.1 Route Configuration

```javascript
// src/App.jsx
const router = createBrowserRouter([
  // Public routes
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  
  // Protected admin routes
  {
    path: '/admin',
    element: <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
  },
  {
    path: '/admin/malls',
    element: <ProtectedRoute requiredRole="admin"><AdminMalls /></ProtectedRoute>
  },
  
  // Protected merchant routes
  {
    path: '/merchant',
    element: <ProtectedRoute requiredRole="merchant"><MerchantDashboard /></ProtectedRoute>
  },
  {
    path: '/merchant/products/add',
    element: <ProtectedRoute requiredRole="merchant"><AddProduct /></ProtectedRoute>
  },
  
  // Protected user routes
  {
    path: '/user',
    element: <Navigate to="/user/malls" replace />
  },
  {
    path: '/user/malls',
    element: <ProtectedRoute requiredRole="user"><MallSelection /></ProtectedRoute>
  },
  {
    path: '/user/shops',
    element: <ProtectedRoute requiredRole="user"><UserShops /></ProtectedRoute>
  }
]);
```

### 8.2 Protected Route Implementation

```javascript
// src/components/ProtectedRoute.jsx
const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, userRole, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};
```

### 8.3 Navigation Patterns

**Programmatic Navigation:**
```javascript
const navigate = useNavigate();

// After successful login
const handleLogin = async () => {
  const result = await login(email, password);
  if (result.success) {
    if (userRole === 'admin') navigate('/admin');
    else if (userRole === 'merchant') navigate('/merchant');
    else navigate('/user/malls');
  }
};

// After creating product
const handleSubmit = async () => {
  const result = await createProduct(productData);
  if (result.success) {
    navigate('/merchant/products');
  }
};
```

**Link Navigation:**
```javascript
// In Navbar
<Link to="/user/shops" className="nav-link">
  Browse Shops
</Link>

// In ProductCard (with state)
<Link 
  to={`/user/products/${product.id}`}
  state={{ product }}
>
  View Details
</Link>
```

---

## 9. Error Handling

### 9.1 Try-Catch Pattern

```javascript
const fetchData = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const data = await getDocs(collection(db, 'products'));
    setProducts(data.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })));
  } catch (error) {
    console.error('Error fetching products:', error);
    setError('Failed to load products. Please try again.');
    
    // Log to Firestore
    await logError.general(
      currentUser?.uid,
      error.message,
      error.stack
    );
  } finally {
    setLoading(false);
  }
};
```

### 9.2 Form Validation

```javascript
const validateProductForm = (data) => {
  const errors = {};
  
  if (!data.name || data.name.trim().length < 3) {
    errors.name = 'Product name must be at least 3 characters';
  }
  
  if (!data.price || data.price <= 0) {
    errors.price = 'Price must be greater than 0';
  }
  
  if (!data.imageURL) {
    errors.imageURL = 'Product image is required';
  }
  
  if (!data.shopId) {
    errors.shopId = 'Please select a shop';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
```

### 9.3 Firebase Error Handling

```javascript
const handleFirebaseError = (error) => {
  const errorMessages = {
    'auth/user-not-found': 'No user found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'Email already registered',
    'auth/weak-password': 'Password should be at least 6 characters',
    'permission-denied': 'You don\'t have permission for this action',
    'not-found': 'Document not found',
    'already-exists': 'Document already exists'
  };
  
  return errorMessages[error.code] || error.message;
};

// Usage
try {
  await signInWithEmailAndPassword(auth, email, password);
} catch (error) {
  const message = handleFirebaseError(error);
  setError(message);
  await logError.firebaseError(null, 'login', error.code);
}
```

---

## 10. Performance Optimization

### 10.1 Code Splitting

```javascript
// Lazy load route components
const AdminDashboard = lazy(() => 
  import('./pages/admin/AdminDashboard')
);
const MerchantProducts = lazy(() => 
  import('./pages/merchant/MerchantProducts')
);

// Wrap with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <AdminDashboard />
</Suspense>
```

### 10.2 Memoization

```javascript
// Memo expensive calculations
const filteredProducts = useMemo(() => {
  return products.filter(product => {
    // Complex filtering logic
    return matchesFilters(product, filters);
  });
}, [products, filters]);

// Memo callbacks
const handleFilterChange = useCallback((newFilters) => {
  setFilters(newFilters);
  logUser.filter(currentUser.uid, 'category', newFilters.category);
}, [currentUser]);

// Memo components
const ProductCard = memo(({ product }) => {
  return <div>{product.name}</div>;
});
```

### 10.3 Firestore Query Optimization

```javascript
// Use query limits
const recentProducts = query(
  collection(db, 'products'),
  orderBy('createdAt', 'desc'),
  limit(20) // Only fetch 20 items
);

// Create composite indexes
// In Firebase Console:
// products: mallId (Ascending), createdAt (Descending)

// Use pagination
const [lastVisible, setLastVisible] = useState(null);

const loadMore = async () => {
  const q = query(
    collection(db, 'products'),
    orderBy('createdAt', 'desc'),
    startAfter(lastVisible),
    limit(10)
  );
  
  const snapshot = await getDocs(q);
  setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
};
```

### 10.4 Image Optimization

```javascript
// Cloudinary transformations
const optimizeImageUrl = (url, options = {}) => {
  const {
    width = 800,
    quality = 'auto',
    format = 'auto'
  } = options;
  
  // Insert transformations before /upload/
  return url.replace(
    '/upload/',
    `/upload/w_${width},q_${quality},f_${format}/`
  );
};

// Usage
<img 
  src={optimizeImageUrl(product.imageURL, { width: 400 })}
  alt={product.name}
  loading="lazy"
/>
```

### 10.5 Debouncing Search

```javascript
const [searchTerm, setSearchTerm] = useState('');
const [debouncedTerm, setDebouncedTerm] = useState('');

// Debounce search input
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedTerm(searchTerm);
    if (searchTerm) {
      logUser.search(
        currentUser.uid,
        searchTerm,
        filteredProducts.length
      );
    }
  }, 500);
  
  return () => clearTimeout(timer);
}, [searchTerm]);

// Use debounced term for filtering
useEffect(() => {
  // Filter products based on debouncedTerm
}, [debouncedTerm]);
```

---

## 11. Security Considerations

### 11.1 Client-Side Validation

```javascript
// Sanitize user input
const sanitizeInput = (input) => {
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
};

const handleSubmit = (e) => {
  const cleanName = sanitizeInput(formData.name);
  const cleanDescription = sanitizeInput(formData.description);
  // ... proceed with clean data
};
```

### 11.2 Role-Based Access Control

```javascript
// Check permissions before operations
const canEditShop = (shop) => {
  if (userRole === 'admin') return true;
  if (userRole === 'merchant') {
    return shop.merchantId === currentUser.uid;
  }
  return false;
};

const handleEdit = () => {
  if (!canEditShop(currentShop)) {
    alert('You don\'t have permission to edit this shop');
    return;
  }
  // Proceed with edit
};
```

### 11.3 Environment Variables

```javascript
// Never commit sensitive keys
// Use .env file (gitignored)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset

// Access in code
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
```

---

## 12. Testing Strategy

### 12.1 Unit Tests (Planned)

```javascript
// Example: Test product validation
describe('validateProductForm', () => {
  it('should return error for empty name', () => {
    const result = validateProductForm({ name: '' });
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });
  
  it('should return error for negative price', () => {
    const result = validateProductForm({ price: -10 });
    expect(result.isValid).toBe(false);
    expect(result.errors.price).toBeDefined();
  });
});
```

### 12.2 Integration Tests (Planned)

```javascript
// Test Firebase integration
describe('Product CRUD', () => {
  it('should create product in Firestore', async () => {
    const productData = {
      name: 'Test Product',
      price: 100
    };
    const result = await createProduct(productData);
    expect(result.success).toBe(true);
    expect(result.id).toBeDefined();
  });
});
```

---

## 13. Deployment Configuration

### 13.1 Build Process

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### 13.2 Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore']
        }
      }
    }
  }
});
```

---

## 14. Conclusion

This Low Level Design document provides comprehensive technical specifications for implementing the Super Mall Web Application. It covers:

- ✅ Component architecture and hierarchy
- ✅ Data flow patterns
- ✅ State management strategies
- ✅ API integration details
- ✅ Database operations
- ✅ Routing and navigation
- ✅ Error handling mechanisms
- ✅ Performance optimization techniques
- ✅ Security best practices

**Next Steps:**
1. Review and approve LLD
2. Implement components as per specifications
3. Write unit and integration tests
4. Conduct code reviews
5. Deploy to production

---

**Document Version:** 1.0  
**Last Updated:** March 2026  
**Status:** Approved ✅
