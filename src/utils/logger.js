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
  categoryCreate: (userId, categoryName) => 
    logAction(userId, 'CATEGORY_CREATE', `Created category: ${categoryName}`),
  categoryDelete: (userId, categoryName) => 
    logAction(userId, 'CATEGORY_DELETE', `Deleted category: ${categoryName}`),
  floorCreate: (userId, floorName) => 
    logAction(userId, 'FLOOR_CREATE', `Created floor: ${floorName}`),
  floorDelete: (userId, floorName) => 
    logAction(userId, 'FLOOR_DELETE', `Deleted floor: ${floorName}`)
};
