# Fix: ERR_CONNECTION_REFUSED

## The Problem

You're seeing:
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
:5000/api/auth/register
```

This means **your backend server is not running or not accessible**.

## Quick Fix Checklist

### ✅ Step 1: Is Backend Running?

1. **Check your backend terminal:**
   - Look for this message: `🚀 Server running on port 5000`
   - If you don't see it, the backend isn't running

2. **If backend isn't running:**
   ```bash
   cd backend
   npm run dev
   ```

### ✅ Step 2: Did MongoDB Connect?

**Important:** The backend won't start the server until MongoDB connects!

Look for in your backend console:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

**If you see MongoDB errors:**
- Refer to `MONGODB_SETUP.md`
- Make sure MongoDB is running or Atlas connection string is correct

### ✅ Step 3: Verify Backend Started

You should see these messages in order:
```
✅ Connected to MongoDB
📍 Database: mongodb://...
🚀 Server running on port 5000
🌐 API URL: http://localhost:5000
📡 Socket.io ready for real-time connections
```

**If you DON'T see all of these:** The server didn't start properly.

### ✅ Step 4: Test Backend Directly

Open your browser and visit:
```
http://localhost:5000/api/health
```

**Expected response:**
```json
{"status":"ok","message":"Symphonia API is running"}
```

**If this fails:**
- Backend is not running
- Backend is on a different port
- Firewall/antivirus is blocking it

### ✅ Step 5: Check Port Conflict

Another app might be using port 5000:

**Windows:**
```powershell
netstat -ano | findstr :5000
```

**Mac/Linux:**
```bash
lsof -i :5000
```

If something is using port 5000:
- Change port in `backend/.env`: `PORT=5001`
- Update `frontend/.env`: `VITE_API_URL=http://localhost:5001`

### ✅ Step 6: Restart Everything

1. **Stop backend:** Press `Ctrl+C` in backend terminal
2. **Stop frontend:** Press `Ctrl+C` in frontend terminal
3. **Start backend:** 
   ```bash
   cd backend
   npm run dev
   ```
   Wait for: `🚀 Server running on port 5000`
4. **Start frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

## Common Issues

### Issue 1: Backend Crashed Before Starting

**Symptom:** Backend terminal shows errors and exits

**Fix:** Check backend console for:
- MongoDB connection errors → Fix MongoDB
- Missing `.env` file → Create `backend/.env`
- Missing dependencies → Run `npm install` in backend

### Issue 2: Backend Running But Port Wrong

**Check:** Look at backend console for actual port:
```
🚀 Server running on port 5001  ← Note the port!
```

**Fix:** Update `frontend/.env`:
```env
VITE_API_URL=http://localhost:5001  ← Match the actual port
```

### Issue 3: Firewall/Antivirus Blocking

**Symptoms:**
- Backend shows "Server running" but can't connect
- Windows Firewall popup

**Fix:**
1. Allow Node.js through firewall
2. Temporarily disable antivirus to test
3. Check Windows Defender Firewall settings

### Issue 4: Backend Not Listening on Correct Interface

**Rare but possible:** Backend might only listen on `127.0.0.1` instead of `localhost`

**Test:** Try in browser:
- `http://127.0.0.1:5000/api/health`
- `http://localhost:5000/api/health`

## Verify It's Fixed

1. ✅ Backend console shows: `🚀 Server running on port 5000`
2. ✅ Browser: `http://localhost:5000/api/health` returns JSON
3. ✅ Frontend can register/login without `ERR_CONNECTION_REFUSED`

## Still Not Working?

**Check these files:**

1. **backend/.env** - Must have:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   ```

2. **frontend/.env** - Must have:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

3. **Restart both servers** after changing `.env` files

## Debug Commands

**Test backend manually:**
```bash
# In backend folder
node server.js
```

**Check if port is in use:**
```bash
# Windows PowerShell
Get-NetTCPConnection -LocalPort 5000

# Mac/Linux
lsof -i :5000
```

**Kill process on port (if needed):**
```bash
# Windows
taskkill /PID <process_id> /F

# Mac/Linux
kill -9 <process_id>
```
