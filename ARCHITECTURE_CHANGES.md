# Super Mall Application - New Architecture

## Overview
This document describes the refactored architecture where admin and merchant roles have clear separation of concerns.

## Role Separation

### Admin Role
**Responsibilities:**
- Create and manage super mall structures
- Create merchant accounts with password visibility
- View all malls, merchants, and shops (read-only for shops)
- Set maximum merchant limits per mall
- Assign merchants to specific malls

**Admin CANNOT:**
- Create, edit, or delete shops
- Create, edit, or delete products
- Create, edit, or delete offers
- Create, edit, or delete categories or floors

### Merchant Role
**Responsibilities:**
- Create and manage shops in their assigned mall
- Create and manage products in their shops
- Create and manage offers
- Create and manage categories and floors
- Full control over shop operations

**Merchant MUST:**
- Be assigned to a mall by admin before creating shops
- Can only create shops in their assigned mall

### User Role
**Responsibilities:**
- Browse shops, products, and offers
- Compare products
- View shop details
- Filter and search

## Database Schema Changes

### Malls Collection
```javascript
{
  mallName: string,
  location: string,
  description: string,
  maxMerchants: number,        // NEW: Maximum merchants allowed
  currentMerchants: number,     // NEW: Current merchant count
  createdAt: timestamp,
  createdBy: userId (admin)
}
```
**Removed:** `merchantId` field (no longer 1:1 relationship)

### Users Collection (Merchants)
```javascript
{
  name: string,
  email: string,
  contactNumber: string,
  role: 'merchant',
  mallId: string,               // Mall they're assigned to
  mallName: string,             // For easy display
  adminViewPassword: string,    // NEW: Password stored for admin viewing
  createdAt: timestamp,
  createdBy: userId (admin)
}
```

### Shops Collection
```javascript
{
  shopName: string,
  category: string,
  floor: string,
  description: string,
  contactNumber: string,
  imageURL: string,
  ownerId: userId (merchant),
  mallId: string,               // NEW: Mall this shop belongs to
  mallName: string,             // NEW: For easy display
  createdAt: timestamp
}
```

## Password Management (Option A - Selected)
**Approach:** Store encrypted password and show when admin edits

**Implementation:**
- Password stored in `adminViewPassword` field in merchant user document
- Displayed when admin edits merchant details
- Password field is read-only, not editable
- Security note: This is for admin convenience only

**Security Considerations:**
- Passwords stored in plain text in Firestore (encrypted at rest by Firebase)
- Only accessible to admin role via Firebase rules
- Consider implementing backend encryption for production

## Workflow

### 1. Admin Creates Mall
```
Navigate to: /admin/create-mall
Fields:
- Mall Name
- Location
- Description
- Maximum Merchants (default: 10)
```

### 2. Admin Creates Merchant
```
Navigate to: /admin/create-merchant
Fields:
- Merchant Name
- Email
- Password (visible to admin)
- Contact Number
- Assign to Mall (dropdown)

Validation:
- Checks if mall has reached max merchant limit
- Increments mall's currentMerchants count
```

### 3. Merchant Creates Shop
```
Navigate to: /merchant/create-shop
Fields:
- Shop Name
- Category
- Floor
- Description
- Contact Number
- Image

Validation:
- Merchant must have mallId assigned
- Shop automatically assigned to merchant's mall
```

## Key Changes from Previous Architecture

### Before:
1. Admin creates mall + merchant together (1:1 relationship)
2. Admin could create/edit shops
3. Single merchant per mall
4. Password not visible to admin after creation

### After:
1. Admin creates malls separately from merchants
2. Admin creates merchants and assigns to malls (1:many relationship)
3. Multiple merchants per mall (with configurable limit)
4. Admin can view merchant passwords when editing
5. Only merchants can create/manage shops
6. Admin has read-only access to shops

## File Changes Summary

### Modified Files:
1. **AdminCreateMall.jsx** - Removed merchant creation, added maxMerchants field
2. **AdminEditMall.jsx** - Removed merchant editing, added maxMerchants editing
3. **AdminCreateMerchant.jsx** - Full rewrite with mall selection and password storage
4. **AdminEditMerchant.jsx** - Added password display and mall reassignment
5. **AdminMerchants.jsx** - Added mall column and delete functionality
6. **AdminViewMall.jsx** - Shows merchant count instead of single merchant
7. **CreateShop.jsx** (merchant) - Gets mall from user profile
8. **App.jsx** - Removed admin shop creation routes
9. **AdminDashboard.jsx** - Updated workflow and action buttons

### New Files:
1. **firestore.rules** - Updated Firebase security rules

## Testing Checklist

- [ ] Admin can create malls with maxMerchants
- [ ] Admin can create merchants and assign to malls
- [ ] Merchant count validation works (cannot exceed maxMerchants)
- [ ] Admin can view password when editing merchant
- [ ] Admin can reassign merchant to different mall
- [ ] Merchant can create shops in assigned mall
- [ ] Merchant cannot create shops without mall assignment
- [ ] Admin cannot create shops (routes removed)
- [ ] Firebase rules enforce role permissions
- [ ] Deleting merchant decrements mall's currentMerchants count

## Deployment Steps

1. **Update Firestore Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Migrate Existing Data** (if any)
   - Add `maxMerchants` and `currentMerchants` to existing malls
   - Add `adminViewPassword` to existing merchants
   - Add `mallId` and `mallName` to existing shops
   - Remove `merchantId` from malls

3. **Test in Development**
   - Create test mall
   - Create test merchant
   - Verify merchant can create shop
   - Verify admin cannot create shop

4. **Deploy Application**
   ```bash
   npm run build
   firebase deploy
   ```

## Security Notes

### Password Storage:
- **Current Implementation:** Plain text in Firestore
- **Recommendation for Production:** Implement server-side encryption using Cloud Functions
- **Alternative:** Use Firebase Admin SDK to reset passwords on demand

### Firebase Rules:
- Admin role verified for all mall/merchant operations
- Merchant role verified for all shop/product/offer operations
- Shop creation validates merchant's mall assignment
- Users collection restricts access to own document + admin

## Future Enhancements

1. **Password Encryption:** Implement Cloud Functions for password encryption
2. **Email Notifications:** Send credentials to merchants via email
3. **Bulk Import:** Allow admin to import multiple merchants from CSV
4. **Merchant Dashboard:** Show which mall they're assigned to
5. **Mall Analytics:** Show detailed statistics per mall
6. **Merchant Limits:** Allow different limits for different malls
7. **Shop Transfer:** Allow reassigning shops between merchants

## Support

For questions or issues:
- Check Firebase console for authentication/database errors
- Verify role assignments in Firestore users collection
- Check browser console for client-side errors
- Review Firebase rules for permission issues
