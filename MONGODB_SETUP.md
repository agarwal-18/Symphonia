# MongoDB Setup Guide for Symphonia

## Quick Fix for Connection Error

If you see this error:
```
MongooseServerSelectionError: connect ECONNREFUSED ::1:27017
```

MongoDB is not running or not configured. Follow one of the options below.

## Option 1: MongoDB Atlas (Cloud - Recommended) ✅

**Best for:** Beginners, no local installation needed, works anywhere

### Steps:

1. **Sign up** at https://www.mongodb.com/cloud/atlas/register
   - Use your email or GitHub account

2. **Create a Free Cluster**
   - Click "Build a Database"
   - Select "M0 FREE" (Free forever tier)
   - Choose a cloud provider and region
   - Click "Create"

3. **Create Database User**
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Enter username and password (save these!)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP for production
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **Update your `.env` file:**
   ```env
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/symphonia?retryWrites=true&w=majority
   ```
   - Replace `your_username` and `your_password` with your database user credentials
   - Replace `cluster0.xxxxx` with your actual cluster name
   - Add `/symphonia` before the `?` to specify the database name

### Example:
```
mongodb+srv://johndoe:MyPassword123@cluster0.abc123.mongodb.net/symphonia?retryWrites=true&w=majority
```

## Option 2: Local MongoDB Installation

**Best for:** Developers who want full control, offline development

### Windows:

1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows, MSI installer
   - Download and run installer

2. **Install MongoDB**
   - Choose "Complete" installation
   - Install as Windows Service (recommended)
   - Install MongoDB Compass (optional GUI tool)

3. **Verify Installation**
   - Open Command Prompt as Administrator
   - MongoDB service should auto-start
   - Check service status: `sc query MongoDB`

4. **Use in your `.env`:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/symphonia
   ```

### macOS:

1. **Install via Homebrew:**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **Start MongoDB:**
   ```bash
   brew services start mongodb-community
   ```

3. **Verify it's running:**
   ```bash
   brew services list
   ```

4. **Use in your `.env`:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/symphonia
   ```

### Linux:

1. **Install MongoDB:**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install -y mongodb
   
   # Or use official MongoDB repo
   wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

2. **Start MongoDB:**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

3. **Verify:**
   ```bash
   sudo systemctl status mongod
   ```

4. **Use in your `.env`:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/symphonia
   ```

## Testing Your Connection

After setting up, test your connection:

1. **Start the backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Look for this message:**
   ```
   ✅ Connected to MongoDB
   ```

3. **If you see errors:**
   - Check your `.env` file has the correct `MONGODB_URI`
   - For Atlas: Verify username/password and network access settings
   - For Local: Verify MongoDB service is running

## Troubleshooting

### "Authentication failed"
- Check username and password in connection string
- Make sure special characters in password are URL-encoded

### "Network access denied"
- In MongoDB Atlas, go to Network Access
- Add your IP address or allow access from anywhere

### "Service not running" (Local)
- Windows: Open Services, find MongoDB, start it
- macOS: `brew services start mongodb-community`
- Linux: `sudo systemctl start mongod`

### Connection timeout
- Check firewall settings
- Verify MongoDB is listening on port 27017
- For Atlas: Check your internet connection

## Which Option Should I Choose?

- **New to MongoDB?** → Use **MongoDB Atlas** (Option 1)
- **Want offline development?** → Use **Local MongoDB** (Option 2)
- **Deploying to production?** → Use **MongoDB Atlas** (Option 1)

## Need Help?

- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- MongoDB Installation Guide: https://docs.mongodb.com/manual/installation/
- Community Support: https://developer.mongodb.com/community/forums/
