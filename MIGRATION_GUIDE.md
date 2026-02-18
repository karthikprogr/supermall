# Data Migration Guide

## If you have existing data in Firebase, follow these steps to migrate to the new architecture:

### 1. Backup Your Data
Before making any changes, export your Firestore data:
1. Go to Firebase Console → Firestore Database
2. Click on the three dots menu → Export data
3. Save the backup

### 2. Update Malls Collection
For each existing mall document, add these fields:

```javascript
// Add to each mall document
{
  maxMerchants: 10,           // Set to desired limit
  currentMerchants: 1,        // Count of existing merchants for this mall
}

// Remove this field
// merchantId: "xxx"          // This field is no longer needed
```

**Firestore Console Steps:**
1. Navigate to `malls` collection
2. Click on each mall document
3. Click "Add field"
   - Field: `maxMerchants`, Type: number, Value: 10
4. Click "Add field"
   - Field: `currentMerchants`, Type: number, Value: 1 (or count actual merchants)
5. Delete `merchantId` field if it exists

### 3. Update Users Collection (Merchants)
For each merchant document, add password field:

```javascript
// Add to each merchant document
{
  adminViewPassword: "original_password",  // The password you originally set
  mallId: "mall_document_id",             // Already exists, verify it's correct
  mallName: "Mall Name"                    // Already exists, verify it's correct
}
```

**Note:** If you don't have the original passwords, you'll need to:
- Either reset them manually in Firebase Authentication
- Or ask merchants to use "Forgot Password" feature

**Firestore Console Steps:**
1. Navigate to `users` collection
2. Filter by role == 'merchant'
3. For each merchant:
   - Click "Add field"
     - Field: `adminViewPassword`, Type: string, Value: the password
   - Verify `mallId` field exists
   - Verify `mallName` field exists

### 4. Update Shops Collection
For each shop document, ensure these fields exist:

```javascript
// Verify/add to each shop document
{
  mallId: "mall_document_id",      // Mall this shop belongs to
  mallName: "Mall Name",           // Mall name for display
  ownerId: "merchant_user_id"      // Already exists, verify it's correct
}
```

**Firestore Console Steps:**
1. Navigate to `shops` collection
2. For each shop:
   - Verify `ownerId` exists
   - Add `mallId` if missing (get from shop owner's user document)
   - Add `mallName` if missing

### 5. Update Firebase Rules
Replace your existing Firestore rules with the new rules:

1. Copy content from `firestore.rules` file
2. Go to Firebase Console → Firestore Database → Rules
3. Paste the new rules
4. Click "Publish"

### 6. Test the Migration
1. Login as admin
2. Try creating a new mall (should work)
3. Try creating a new merchant (should work)
4. Login as existing merchant
5. Try creating a new shop (should work if mallId is assigned)

### 7. Clean Up Old Files (Optional)
These files are no longer used and can be deleted:

```
src/pages/admin/AdminCreateShop.jsx
src/pages/admin/AdminEditShop.jsx
```

**Do NOT delete:**
- `AdminShops.jsx` - Still used for viewing all shops
- `AdminViewShop.jsx` - Still used for viewing shop details

## Quick Migration Script (Optional)

If you have many documents, you can use this Cloud Function or Node.js script:

```javascript
// Run this in Firebase Functions or Node.js with Firebase Admin SDK
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

async function migrateMalls() {
  const mallsRef = db.collection('malls');
  const snapshot = await mallsRef.get();
  
  const batch = db.batch();
  
  snapshot.forEach(doc => {
    const mallRef = mallsRef.doc(doc.id);
    batch.update(mallRef, {
      maxMerchants: 10,
      currentMerchants: 1,
      merchantId: admin.firestore.FieldValue.delete()
    });
  });
  
  await batch.commit();
  console.log('Malls migrated successfully');
}

async function migrateShops() {
  const shopsRef = db.collection('shops');
  const snapshot = await shopsRef.get();
  
  const batch = db.batch();
  
  for (const doc of snapshot.docs) {
    const shopData = doc.data();
    
    // Get merchant's mall assignment
    if (shopData.ownerId) {
      const merchantDoc = await db.collection('users').doc(shopData.ownerId).get();
      if (merchantDoc.exists) {
        const merchantData = merchantDoc.data();
        
        const shopRef = shopsRef.doc(doc.id);
        batch.update(shopRef, {
          mallId: merchantData.mallId || '',
          mallName: merchantData.mallName || ''
        });
      }
    }
  }
  
  await batch.commit();
  console.log('Shops migrated successfully');
}

// Run migrations
migrateMalls()
  .then(() => migrateShops())
  .then(() => console.log('All migrations complete'))
  .catch(error => console.error('Migration error:', error));
```

## Verification Checklist

After migration, verify:

- [ ] All malls have `maxMerchants` and `currentMerchants` fields
- [ ] No malls have `merchantId` field
- [ ] All merchants have `mallId`, `mallName`, and `adminViewPassword`
- [ ] All shops have `mallId` and `mallName`
- [ ] Firebase rules are updated and published
- [ ] Admin can create malls
- [ ] Admin can create merchants
- [ ] Admin can view merchant passwords
- [ ] Merchants can create shops
- [ ] Existing shops still display correctly

## Rollback Plan

If something goes wrong:

1. Restore Firestore data from backup
2. Revert code changes using Git:
   ```bash
   git checkout <previous-commit-hash>
   ```
3. Restore old Firebase rules from backup

## Need Help?

If you encounter issues during migration:
1. Check Firebase Console for error messages
2. Check browser console for client errors
3. Verify all fields are correctly named (case-sensitive)
4. Ensure Firebase rules are published
5. Clear browser cache and try again
