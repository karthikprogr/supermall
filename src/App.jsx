import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import ProtectedRoute from './components/ProtectedRoute';

// Route-level code splitting
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminShops = lazy(() => import('./pages/admin/AdminShops'));
const AdminCreateMerchant = lazy(() => import('./pages/admin/AdminCreateMerchant'));
const AdminMerchants = lazy(() => import('./pages/admin/AdminMerchants'));
const AdminEditMerchant = lazy(() => import('./pages/admin/AdminEditMerchant'));
const AdminCreateMall = lazy(() => import('./pages/admin/AdminCreateMall'));
const AdminMalls = lazy(() => import('./pages/admin/AdminMalls'));
const AdminViewMall = lazy(() => import('./pages/admin/AdminViewMall'));
const AdminEditMall = lazy(() => import('./pages/admin/AdminEditMall'));
const AdminViewShop = lazy(() => import('./pages/admin/AdminViewShop'));

const MerchantDashboard = lazy(() => import('./pages/merchant/MerchantDashboard'));
const MerchantShops = lazy(() => import('./pages/merchant/MerchantShops'));
const CreateShop = lazy(() => import('./pages/merchant/CreateShop'));
const MerchantProducts = lazy(() => import('./pages/merchant/MerchantProducts'));
const AddProduct = lazy(() => import('./pages/merchant/AddProduct'));
const EditProduct = lazy(() => import('./pages/merchant/EditProduct'));
const CreateOffer = lazy(() => import('./pages/merchant/CreateOffer'));

const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));
const MallSelection = lazy(() => import('./pages/user/MallSelection'));
const UserShops = lazy(() => import('./pages/user/UserShops'));
const UserProducts = lazy(() => import('./pages/user/UserProducts'));
const UserOffers = lazy(() => import('./pages/user/UserOffers'));
const UserAccount = lazy(() => import('./pages/user/UserAccount'));
const UserCompare = lazy(() => import('./pages/user/UserCompare'));
const UserSavedItems = lazy(() => import('./pages/user/UserSavedItems'));
const HelpSupport = lazy(() => import('./pages/user/HelpSupport'));

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <div className="app">
            <Navbar />
          <main className="main-content">
            <Suspense fallback={<div className="loading">Loading page...</div>}>
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
            </Suspense>
          </main>
          <MobileBottomNav />
        </div>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
