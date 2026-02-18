# Admin Workflow Guide

## How the System Works Now

### 1. Admin Creates Everything

**Admin is responsible for:**
- ✅ Creating Categories and Floors
- ✅ Creating Merchant Accounts
- ✅ Creating Shops (and assigning to merchants)

### 2. Merchants Manage Their Shops

**Merchants can only:**
- ✅ Login with admin-provided credentials
- ✅ Add products to their assigned shops
- ✅ Create offers for their products
- ❌ Cannot create new shops (only admin can)

### 3. Users Browse Everything

**Regular users can:**
- ✅ Register and login themselves
- ✅ Browse all shops and products
- ✅ Filter by category/floor
- ✅ Compare products and view offers

---

## Step-by-Step Workflow

### Step 1: Admin Setup (First Time)

1. **Create Admin Account:**
   - Go to http://localhost:5174/register
   - Register with your email
   - Go to Firebase Console → Firestore → `users` collection
   - Find your user document
   - Change `role: "user"` to `role: "admin"`
   - Refresh the app

2. **Add Categories:**
   - Login as admin
   - Dashboard → Add categories (e.g., "Electronics", "Fashion", "Food")

3. **Add Floors:**
   - Dashboard → Add floors (e.g., "Ground Floor", "First Floor")

### Step 2: Create Merchant Accounts

1. **Navigate to Create Merchant:**
   - Admin Dashboard → Click **"+ Create Merchant Account"**

2. **Fill Merchant Details:**
   - Name: Merchant's full name
   - Email: merchant@example.com
   - Password: Create a strong password
   - Contact Number: (optional)

3. **Save Credentials:**
   - After creation, you'll see the credentials on screen
   - **Copy and save** the email and password
   - Send these credentials to the merchant securely

4. **Example Credentials:**
   ```
   Email: john@shopowner.com
   Password: shop123456
   ```

### Step 3: Create Shops

1. **Navigate to Create Shop:**
   - Admin Dashboard → Click **"+ Create Shop"**

2. **Fill Shop Details:**
   - Shop Name: "Tech World"
   - Category: Select from dropdown (e.g., "Electronics")
   - Floor: Select from dropdown (e.g., "First Floor")
   - Assign to Merchant: Select merchant from list
   - Description: (optional)
   - Contact Number: (optional)
   - Shop Image: Upload image (Cloudinary)

3. **Click "Create Shop"**
   - Shop is created and assigned to selected merchant

### Step 4: Merchant Workflow

1. **Merchant Logs In:**
   - Go to http://localhost:5174/login
   - Use admin-provided credentials
   - Email: john@shopowner.com
   - Password: shop123456

2. **Merchant Sees Their Shops:**
   - Merchant Dashboard shows only shops assigned to them
   - Cannot see other merchants' shops

3. **Merchant Adds Products:**
   - Navigate to "My Products" → "Add Product"
   - Select their shop from dropdown
   - Add product details and image
   - Submit

4. **Merchant Creates Offers:**
   - Navigate to "Create Offer"
   - Select product and discount percentage
   - Submit

### Step 5: User Experience

1. **Users Register:**
   - Anyone can register at /register
   - Automatically assigned "user" role

2. **Users Browse:**
   - View all shops created by admin
   - Filter by category/floor
   - View all products from all merchants
   - Compare products
   - View active offers

---

## Key Differences from Before

### Before:
- ❌ Merchants could create their own shops
- ❌ Anyone could register as merchant
- ❌ No central control

### Now:
- ✅ Only admin creates shops
- ✅ Only admin creates merchant accounts
- ✅ Admin assigns shops to specific merchants
- ✅ Merchants only manage their assigned shops
- ✅ Complete control and accountability

---

## Firebase Firestore Structure

```
users/
  - {userId}
    - name: "John Doe"
    - email: "john@shopowner.com"
    - role: "merchant"
    - createdBy: {adminId}
    - createdAt: "2026-01-22..."

shops/
  - {shopId}
    - shopName: "Tech World"
    - category: "Electronics"
    - floor: "First Floor"
    - ownerId: {merchantUserId}
    - ownerEmail: "john@shopowner.com"
    - createdBy: {adminId}
    - createdAt: "2026-01-22..."

products/
  - {productId}
    - name: "Laptop"
    - shopId: {shopId}
    - ownerId: {merchantUserId}
    - ...

categories/
  - {categoryId}
    - name: "Electronics"

floors/
  - {floorId}
    - name: "First Floor"
```

---

## Important Notes

1. **Admin Password:** Keep admin credentials very secure
2. **Merchant Credentials:** Send to merchants via secure channel (email, WhatsApp)
3. **Shop Assignment:** One shop can only have one merchant owner
4. **Product Management:** Merchants can only add products to shops they own
5. **Data Integrity:** Admin controls all shop creation for better organization

---

## Testing Checklist

- [ ] Admin can create categories
- [ ] Admin can create floors
- [ ] Admin can create merchant accounts
- [ ] Admin receives merchant credentials after creation
- [ ] Admin can create shops and assign to merchants
- [ ] Merchant can login with provided credentials
- [ ] Merchant sees only their assigned shops
- [ ] Merchant can add products to their shops
- [ ] Merchant can create offers
- [ ] Users can browse all shops and products
- [ ] Filters work correctly

---

**System is now ready for UM Internship requirements!** 🎉
