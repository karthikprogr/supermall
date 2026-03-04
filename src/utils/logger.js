// Action logging utility
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Log user actions to Firestore
 * @param {string} userId - User ID performing the action
 * @param {string} action - Action type (login, product_add, offer_create, etc.)
 * @param {string} description - Detailed description of the action
 * @param {object} metadata - Additional metadata (optional)
 */
export const logAction = async (userId, action, description, metadata = {}) => {
  try {
    await addDoc(collection(db, 'logs'), {
      userId,
      action,
      description,
      metadata,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    });
    console.log(`[LOG] ${action}: ${description}`);
  } catch (error) {
    console.error('Error logging action:', error);
  }
};

/**
 * Log authentication events
 */
export const logAuth = {
  login: (userId, email) => logAction(userId, 'LOGIN', `User logged in: ${email}`),
  logout: (userId, email) => logAction(userId, 'LOGOUT', `User logged out: ${email}`),
  register: (userId, email, role) => logAction(userId, 'REGISTER', `New user registered: ${email} as ${role}`)
};

/**
 * Log shop management events
 */
export const logShop = {
  create: (userId, shopName, shopId) => 
    logAction(userId, 'SHOP_CREATE', `Created shop: ${shopName}`, { shopId }),
  update: (userId, shopName, shopId) => 
    logAction(userId, 'SHOP_UPDATE', `Updated shop: ${shopName}`, { shopId }),
  delete: (userId, shopName, shopId) => 
    logAction(userId, 'SHOP_DELETE', `Deleted shop: ${shopName}`, { shopId })
};

/**
 * Log product management events
 */
export const logProduct = {
  add: (userId, productName, productId, shopId) => 
    logAction(userId, 'PRODUCT_ADD', `Added product: ${productName}`, { productId, shopId }),
  edit: (userId, productName, productId, shopId) => 
    logAction(userId, 'PRODUCT_EDIT', `Edited product: ${productName}`, { productId, shopId }),
  update: (userId, productName, productId) => 
    logAction(userId, 'PRODUCT_UPDATE', `Updated product: ${productName}`, { productId }),
  delete: (userId, productName, productId) => 
    logAction(userId, 'PRODUCT_DELETE', `Deleted product: ${productName}`, { productId })
};

/**
 * Log offer management events
 */
export const logOffer = {
  create: (userId, offerDetails, offerId) => 
    logAction(userId, 'OFFER_CREATE', `Created offer: ${offerDetails}`, { offerId }),
  update: (userId, offerDetails, offerId) => 
    logAction(userId, 'OFFER_UPDATE', `Updated offer: ${offerDetails}`, { offerId }),
  delete: (userId, offerDetails, offerId) => 
    logAction(userId, 'OFFER_DELETE', `Deleted offer: ${offerDetails}`, { offerId })
};

/**
 * Log admin actions
 */
export const logAdmin = {
  mallCreate: (userId, mallName, mallId) => 
    logAction(userId, 'MALL_CREATE', `Created mall: ${mallName}`, { mallId }),
  mallUpdate: (userId, mallName, mallId) => 
    logAction(userId, 'MALL_UPDATE', `Updated mall: ${mallName}`, { mallId }),
  mallDelete: (userId, mallName, mallId) => 
    logAction(userId, 'MALL_DELETE', `Deleted mall: ${mallName}`, { mallId }),
  merchantCreate: (userId, merchantEmail) => 
    logAction(userId, 'MERCHANT_CREATE', `Created merchant account: ${merchantEmail}`),
  merchantUpdate: (userId, merchantId) => 
    logAction(userId, 'MERCHANT_UPDATE', `Updated merchant: ${merchantId}`, { merchantId }),
  categoryCreate: (userId, categoryName) => 
    logAction(userId, 'CATEGORY_CREATE', `Created category: ${categoryName}`),
  categoryDelete: (userId, categoryName) => 
    logAction(userId, 'CATEGORY_DELETE', `Deleted category: ${categoryName}`),
  floorCreate: (userId, floorName) => 
    logAction(userId, 'FLOOR_CREATE', `Created floor: ${floorName}`),
  floorDelete: (userId, floorName) => 
    logAction(userId, 'FLOOR_DELETE', `Deleted floor: ${floorName}`)
};

/**
 * Log user actions
 */
export const logUser = {
  mallSelect: (userId, mallName, mallId) => 
    logAction(userId, 'MALL_SELECT', `Selected mall: ${mallName}`, { mallId }),
  productSave: (userId, productId, productName) => 
    logAction(userId, 'PRODUCT_SAVE', `Saved product: ${productName}`, { productId }),
  productUnsave: (userId, productId, productName) => 
    logAction(userId, 'PRODUCT_UNSAVE', `Removed saved product: ${productName}`, { productId }),
  productCompare: (userId, productIds) => 
    logAction(userId, 'PRODUCT_COMPARE', `Compared ${productIds.length} products`, { productIds }),
  productView: (userId, productId, productName) => 
    logAction(userId, 'PRODUCT_VIEW', `Viewed product: ${productName}`, { productId }),
  shopView: (userId, shopId, shopName) => 
    logAction(userId, 'SHOP_VIEW', `Viewed shop: ${shopName}`, { shopId }),
  offerView: (userId, offerId) => 
    logAction(userId, 'OFFER_VIEW', `Viewed offer`, { offerId }),
  filter: (userId, filterType, filterValue) => 
    logAction(userId, 'FILTER_APPLY', `Applied ${filterType} filter: ${filterValue}`, { filterType, filterValue }),
  search: (userId, searchTerm, resultCount) => 
    logAction(userId, 'SEARCH', `Searched for: ${searchTerm} (${resultCount} results)`, { searchTerm, resultCount })
};

/**
 * Log error events
 */
export const logError = {
  general: (userId, errorMessage, errorStack) => 
    logAction(userId, 'ERROR', `Error occurred: ${errorMessage}`, { errorStack }),
  firebaseError: (userId, operation, errorCode) => 
    logAction(userId, 'FIREBASE_ERROR', `Firebase error in ${operation}: ${errorCode}`, { operation, errorCode }),
  uploadError: (userId, fileName, errorMessage) => 
    logAction(userId, 'UPLOAD_ERROR', `Failed to upload ${fileName}: ${errorMessage}`, { fileName })
};

/**
 * Log performance metrics
 */
export const logPerformance = {
  pageLoad: (userId, pageName, loadTime) => 
    logAction(userId, 'PAGE_LOAD', `Page ${pageName} loaded in ${loadTime}ms`, { pageName, loadTime }),
  imageLoad: (userId, imageUrl, loadTime) => 
    logAction(userId, 'IMAGE_LOAD', `Image loaded in ${loadTime}ms`, { imageUrl, loadTime }),
  dataFetch: (userId, collection, itemCount, fetchTime) => 
    logAction(userId, 'DATA_FETCH', `Fetched ${itemCount} items from ${collection} in ${fetchTime}ms`, { collection, itemCount, fetchTime })
};

/**
 * Console logger for development
 */
export const devLog = {
  info: (message, data) => console.log(`ℹ️ [INFO] ${message}`, data || ''),
  warn: (message, data) => console.warn(`⚠️ [WARN] ${message}`, data || ''),
  error: (message, data) => console.error(`❌ [ERROR] ${message}`, data || ''),
  success: (message, data) => console.log(`✅ [SUCCESS] ${message}`, data || '')
};

/**
 * Export default logger object for easy import
 */
export default {
  logAction,
  logAuth,
  logShop,
  logProduct,
  logOffer,
  logAdmin,
  logUser,
  logError,
  logPerformance,
  devLog
};
