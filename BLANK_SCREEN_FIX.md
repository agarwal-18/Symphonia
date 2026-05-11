# Fix: Blank Screen After Login

## Quick Diagnostic Steps

### 1. Check Browser Console

Open DevTools (F12) and check:
- **Console tab**: Look for red error messages
- **Network tab**: Check if API calls are failing
- Look for React errors or component errors

### 2. Verify Backend is Running

The blank screen might be caused by API calls failing silently. Check:
- Is backend running? (`🚀 Server running on port 5000`)
- Can you visit `http://localhost:5000/api/health`?

### 3. Check User Object

The app might be in a loading state or user isn't set. Check:
1. Open Console
2. Type: `localStorage.getItem('token')` - should return a token
3. Type: The app should show user info in the sidebar

### 4. Common Causes

#### Cause 1: API Call Failing Silently
**Check:** Browser Network tab → Find `/api/projects` or `/api/auth/profile`
- If 401/403: Token expired or invalid
- If 500: Server error
- If ERR_CONNECTION_REFUSED: Backend not running

**Fix:** Check backend console for errors

#### Cause 2: CSS Not Loading
**Check:** Is the page completely blank (white/black) or just no content?
- If completely blank: CSS issue
- If dark background but no content: Component issue

**Fix:** Hard refresh (Ctrl+Shift+R) or check TailwindCSS config

#### Cause 3: React Error
**Check:** Console for React errors
- Component crash
- Undefined variable
- Missing import

**Fix:** Look for error stack trace in console

#### Cause 4: Infinite Loading
**Check:** Does page show "Loading..." forever?
- Profile fetch failing
- User state not updating

**Fix:** Check `fetchProfile` in AuthContext

## Quick Fixes

### Fix 1: Hard Refresh
```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

### Fix 2: Clear Cache & Reload
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Fix 3: Check localStorage
Open Console and run:
```javascript
// Check if token exists
localStorage.getItem('token')

// Check if user should be set
// Clear and re-login if needed
localStorage.clear()
```

### Fix 4: Verify Backend API
1. Visit: `http://localhost:5000/api/health`
2. Should see: `{"status":"ok","message":"Symphonia API is running"}`
3. If fails: Backend isn't running

### Fix 5: Check Network Requests
1. Open DevTools → Network tab
2. Try logging in again
3. Look for:
   - `/api/auth/login` - should be 200
   - `/api/auth/profile` - should be 200
   - `/api/projects` - should be 200 or empty array

## Debugging Steps

### Step 1: Enable Verbose Logging

The app now logs more details. Check console for:
- "Registration error:" or "Login error:"
- "Failed to fetch profile:"
- "Failed to fetch projects:"

### Step 2: Test Components Individually

Try navigating to different routes:
- `/` - Dashboard
- `/feed` - Feed page
- `/profile` - Profile page

If one works but others don't, it's a component-specific issue.

### Step 3: Check React DevTools

If you have React DevTools extension:
1. Check component tree
2. Look for error boundaries
3. Check props/state of components

### Step 4: Verify User State

In Console:
```javascript
// Should return user object
JSON.parse(localStorage.getItem('token'))
```

## Expected Behavior After Login

1. ✅ Login successful → Redirects to `/`
2. ✅ Dashboard loads → Shows "My Projects" or "No projects yet"
3. ✅ Sidebar visible → Shows navigation and user info
4. ✅ API calls succeed → Projects load (even if empty)

## If Still Blank

1. **Check backend logs** for errors
2. **Check browser console** for React/JS errors
3. **Try incognito mode** to rule out extensions
4. **Restart both servers** completely
5. **Check if it's a specific route** - try `/feed` or `/profile` directly

## Error Messages to Look For

- "Failed to fetch profile" → Auth issue
- "Failed to fetch projects" → API issue
- "Cannot read property of undefined" → Component error
- "ERR_CONNECTION_REFUSED" → Backend not running
- "401 Unauthorized" → Token expired/invalid

The ErrorBoundary component will now catch React errors and show a helpful error screen instead of a blank page.
