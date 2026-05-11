# Troubleshooting Guide

## ⚠️ Browser Extension Errors (Can Ignore)

If you see errors like:
```
Denying load of <URL>. Resources must be listed in the web_accessible_resources manifest key...
```

**These are harmless browser extension errors** and don't affect Symphonia. See `BROWSER_EXTENSION_ERRORS.md` for details.

To focus on real errors:
1. Open DevTools Console (F12)
2. Filter out: `-web_accessible_resources -manifest -chrome-extension`
3. Only look at errors from `localhost` or your API URL

---

## 🔴 ERR_CONNECTION_REFUSED (Critical)

If you see:
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
:5000/api/auth/register
```

**This means your backend server is not running!**

**Quick Fix:**
1. Check backend terminal - does it show `🚀 Server running on port 5000`?
2. If not, start backend: `cd backend && npm run dev`
3. Make sure MongoDB connects first (backend won't start without it)
4. Test: Visit `http://localhost:5000/api/health` in browser

See `CONNECTION_REFUSED_FIX.md` for detailed troubleshooting.

---

## Registration Failed Error

If you're seeing "Registration failed" when trying to sign up, follow these steps:

### 1. Check Backend Console

First, check the backend terminal/console where you ran `npm run dev`. Look for:
- Any error messages
- "Registration error:" logs
- MongoDB connection issues

### 2. Verify Environment Variables

Make sure your `backend/.env` file has all required variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/symphonia  # or your Atlas URI
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_characters
```

**Common Issues:**
- ❌ `JWT_SECRET` is missing or empty → Authentication will fail
- ❌ `MONGODB_URI` is incorrect → Database operations will fail

### 3. Check Browser Console

Open your browser's Developer Tools (F12) and check the Console tab:
- Look for red error messages
- Check Network tab for failed API requests
- See what error message the server returned

### 4. Common Error Messages and Solutions

#### "Server configuration error. Please contact administrator."
- **Cause:** `JWT_SECRET` is not set in backend `.env`
- **Fix:** Add `JWT_SECRET=some_long_random_string` to `backend/.env` and restart the server

#### "Email already registered" or "Username already taken"
- **Cause:** Trying to register with existing credentials
- **Fix:** Use a different email/username or log in instead

#### "Unable to connect to server"
- **Cause:** Backend server is not running or wrong API URL
- **Fix:** 
  - Make sure backend is running (`npm run dev` in `backend/` folder)
  - Check `VITE_API_URL` in `frontend/.env` matches your backend URL

#### "Invalid email format"
- **Cause:** Email doesn't match standard format
- **Fix:** Use a valid email like `user@example.com`

#### "Username must be between 3 and 20 characters"
- **Cause:** Username too short or too long
- **Fix:** Choose a username between 3-20 characters

#### "Password must be at least 6 characters"
- **Cause:** Password is too short
- **Fix:** Use a password with at least 6 characters

### 5. Test API Connection

Open your browser and visit:
```
http://localhost:5000/api/health
```

You should see:
```json
{"status":"ok","message":"Symphonia API is running"}
```

If this doesn't work, your backend isn't running.

### 6. Check MongoDB Connection

In your backend console, you should see:
```
✅ Connected to MongoDB
```

If you see connection errors, refer to `MONGODB_SETUP.md`.

### 7. Verify CORS Settings

Make sure in `backend/server.js`:
```javascript
origin: process.env.FRONTEND_URL || "http://localhost:5173"
```

And in `frontend/.env`:
```
VITE_API_URL=http://localhost:5000
```

Both URLs should match your actual setup.

### 8. Still Not Working?

1. **Restart both servers:**
   - Stop backend (Ctrl+C)
   - Stop frontend (Ctrl+C)
   - Start backend: `cd backend && npm run dev`
   - Start frontend: `cd frontend && npm run dev`

2. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear localStorage: DevTools → Application → Local Storage → Clear

3. **Check for typos:**
   - Email format
   - Environment variable names
   - API URLs

4. **Check server logs:**
   - Backend terminal for detailed error messages
   - Look for stack traces that show the exact problem

### Quick Debug Checklist

- [ ] Backend server is running
- [ ] Frontend server is running
- [ ] MongoDB is connected (check backend console)
- [ ] `JWT_SECRET` is set in `backend/.env`
- [ ] `MONGODB_URI` is correct in `backend/.env`
- [ ] `VITE_API_URL` is correct in `frontend/.env`
- [ ] Browser console shows no network errors
- [ ] Username is 3-20 characters
- [ ] Email is valid format
- [ ] Password is at least 6 characters
- [ ] Email/username isn't already registered

### Getting More Details

If you still can't register, check:

1. **Backend logs:** Look for the full error message in the terminal
2. **Browser Network tab:** See the actual HTTP response from the server
3. **Browser Console:** Check for any JavaScript errors

The improved error handling should now show you the specific reason why registration failed.

