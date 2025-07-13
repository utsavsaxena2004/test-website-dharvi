# Custom Design Budget Field Fix

## Issue Description

The custom design form was failing to submit with the following error:
```
Error Code: 22P02
Message: invalid input syntax for type numeric: "₹2,000 - ₹5,000"
```

## Root Cause

The `custom_designs` table has a `budget` field with type `numeric`, but the form was sending budget range strings like:
- "₹2,000 - ₹5,000"
- "₹5,000 - ₹10,000"
- "₹10,000 - ₹20,000"
- etc.

PostgreSQL cannot convert these formatted strings to numeric values, causing the insert operation to fail.

## Solution

### 1. Updated Custom Requests Service

**File:** `src/services/supabaseService.js`

**Change:** Set the `budget` field to `null` and store the budget range string in `special_instructions`:

```javascript
const mappedData = {
  // ... other fields
  budget: null, // Set budget to null since we're storing the range in special_instructions
  special_instructions: JSON.stringify({
    occasion: requestData.occasion,
    full_name: requestData.full_name,
    email: requestData.email,
    phone: requestData.phone,
    delivery_days: requestData.delivery_days,
    budget_range: requestData.budget_range // Store the budget range string here
  }),
  // ... other fields
};
```

### 2. Updated Admin Panel Display

**File:** `src/pages/Admin.jsx`

**Change:** Updated the budget display to use `specialInstructions.budget_range`:

```javascript
<p><strong>Budget:</strong> {specialInstructions.budget_range || 'Not specified'}</p>
```

## Data Flow

1. **Form Input:** User selects "₹2,000 - ₹5,000" from dropdown
2. **Form Data:** `formData.budget = "₹2,000 - ₹5,000"`
3. **Service Mapping:** `budget_range: formData.budget` → stored in `special_instructions`
4. **Database Insert:** `budget: null`, `special_instructions: {"budget_range": "₹2,000 - ₹5,000", ...}`
5. **Admin Display:** Shows `specialInstructions.budget_range`

## Alternative Solutions Considered

### Option 1: Convert to Numeric (Rejected)
- Extract numeric value from string (e.g., "₹2,000 - ₹5,000" → 2000)
- **Problem:** Loses important range information
- **Problem:** Ambiguous for ranges like "Above ₹50,000"

### Option 2: Change Database Schema (Rejected)
- Change `budget` field from `numeric` to `text`
- **Problem:** Requires database migration
- **Problem:** Breaks existing numeric operations if any

### Option 3: Use JSON Field (Chosen)
- Store budget range in `special_instructions` JSON field
- **Advantage:** No schema changes needed
- **Advantage:** Preserves full range information
- **Advantage:** Consistent with other custom request data

## Testing

### Test Case 1: Basic Submission
- Select budget range: "₹2,000 - ₹5,000"
- Fill other required fields
- Submit form
- **Expected:** Success, no 22P02 error

### Test Case 2: Admin Panel Display
- Submit a custom request with budget range
- Go to admin panel → Custom Requests
- **Expected:** Budget range displays correctly

### Test Case 3: All Budget Ranges
Test all available budget options:
- "₹2,000 - ₹5,000"
- "₹5,000 - ₹10,000"
- "₹10,000 - ₹20,000"
- "₹20,000 - ₹50,000"
- "Above ₹50,000"

## Files Modified

1. `src/services/supabaseService.js` - Updated custom request creation
2. `src/pages/Admin.jsx` - Updated budget display
3. `CUSTOM_DESIGN_BUDGET_FIX.md` - This documentation

## Verification Steps

1. **Test Form Submission:**
   - Go to `/custom-design`
   - Upload an image
   - Fill the form with any budget range
   - Submit the form
   - Should succeed without 22P02 error

2. **Test Admin Panel:**
   - Go to `/admin`
   - Navigate to "Custom Requests" tab
   - Verify budget range displays correctly

3. **Check Database:**
   - Verify `budget` field is null
   - Verify `special_instructions` contains budget_range

## Status: ✅ FIXED

The custom design form now successfully submits with budget range selections, and the admin panel correctly displays the budget information. 