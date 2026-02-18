import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminShops from './pages/admin/AdminShops';
import AdminCreateMerchant from './pages/admin/AdminCreateMerchant';
import AdminMerchants from './pages/admin/AdminMerchants';
import AdminEditMerchant from './pages/admin/AdminEditMerchant';
import AdminCreateMall from './pages/admin/AdminCreateMall';
import AdminMalls from './pages/admin/AdminMalls';
import AdminViewMall from './pages/admin/AdminViewMall';
import AdminEditMall from './pages/admin/AdminEditMall';
import AdminViewShop from './pages/admin/AdminViewShop';

// Merchant Pages
import MerchantDashboard from './pages/merchant/MerchantDashboard';
import MerchantShops from './pages/merchant/MerchantShops';
import CreateShop from './pages/merchant/CreateShop';
import MerchantProducts from './pages/merchant/MerchantProducts';
import AddProduct from './pages/merchant/AddProduct';
import EditProduct from './pages/merchant/EditProduct';
import CreateOffer from './pages/merchant/CreateOffer';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import MallSelection from './pages/user/MallSelection';
import UserShops from './pages/user/UserShops';
import UserProducts from './pages/user/UserProducts';
import UserOffers from './pages/user/UserOffers';
import UserAccount from './pages/user/UserAccount';
import UserCompare from './pages/user/UserCompare';
import UserSavedItems from './pages/user/UserSavedItems';
import HelpSupport from './pages/user/HelpSupport';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <div className="app">
            <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/shops"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminShops />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/floors"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/create-merchant"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminCreateMerchant />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/merchants"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminMerchants />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/edit-merchant/:merchantId"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminEditMerchant />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/view-shop/:id"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminViewShop />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/create-mall"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminCreateMall />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/malls"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminMalls />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/view-mall/:id"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminViewMall />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/edit-mall/:id"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminEditMall />
                  </ProtectedRoute>
                }
              />

              {/* Merchant Routes */}
              <Route
                path="/merchant"
                element={
                  <ProtectedRoute allowedRoles={['merchant']}>
                    <MerchantDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/merchant/shops"
                element={
                  <ProtectedRoute allowedRoles={['merchant']}>
                    <MerchantShops />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/merchant/shops/create"
                element={
                  <ProtectedRoute allowedRoles={['merchant']}>
                    <CreateShop />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/merchant/products"
                element={
                  <ProtectedRoute allowedRoles={['merchant']}>
                    <MerchantProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/merchant/products/add"
                element={
                  <ProtectedRoute allowedRoles={['merchant']}>
                    <AddProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/merchant/products/edit/:productId"
                element={
                  <ProtectedRoute allowedRoles={['merchant']}>
                    <EditProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/merchant/offers/create"
                element={
                  <ProtectedRoute allowedRoles={['merchant']}>
                    <CreateOffer />
                  </ProtectedRoute>
                }
              />

              {/* User Routes */}
              <Route
                path="/user"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <Navigate to="/user/malls" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/malls"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <MallSelection />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <Navigate to="/user/shops" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/shops"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <UserShops />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/products"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <UserProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/offers"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <UserOffers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/account"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <UserAccount />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/compare"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <UserCompare />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/saved-items"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <UserSavedItems />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/help-support"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <HelpSupport />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <MobileBottomNav />
        </div>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
