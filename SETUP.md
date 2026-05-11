# Symphonia Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas) - **Required**
- Cloudinary account (for audio storage)
- OpenAI API key (for AI suggestions)

## Quick Start

### 1. MongoDB Setup

**Option A: MongoDB Atlas (Recommended for beginners)**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a new cluster (Free tier is fine)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`)
6. Replace `<password>` with your database password
7. Add `/symphonia` at the end: `mongodb+srv://...@cluster.mongodb.net/symphonia?retryWrites=true&w=majority`

**Option B: Local MongoDB**
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. MongoDB will run on `mongodb://localhost:27017`

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
# For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/symphonia?retryWrites=true&w=majority
# For local MongoDB, use: mongodb://localhost:27017/symphonia
MONGODB_URI=mongodb://localhost:27017/symphonia
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OPENAI_API_KEY=your_openai_api_key
FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

**⚠️ Important:** Make sure MongoDB is running before starting the server, or you'll get a connection error.

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Features Implemented

✅ **Authentication**
- User registration and login
- JWT-based authentication
- Protected routes

✅ **Project Management**
- Create, view, update, and delete projects
- Public/private project settings
- Tags and descriptions

✅ **Audio Upload**
- Drag-and-drop file upload
- Cloudinary integration for storage
- Support for MP3, WAV, M4A, AAC formats
- 100MB file size limit

✅ **Waveform Visualization**
- Wavesurfer.js integration
- Audio playback controls
- Volume control
- Skip forward/backward

✅ **Timestamp-Based Comments**
- Add comments at specific timestamps
- Reply to comments
- Real-time comment updates via Socket.io
- Mark comments as resolved

✅ **Version Management**
- Create new project versions
- Track version history
- Switch between versions

✅ **Collaboration**
- Add collaborators to projects
- Role-based access (editor, viewer, commenter)
- Real-time updates via Socket.io

✅ **AI Suggestions**
- OpenAI integration for mixing suggestions
- Composition recommendations
- Context-aware AI responses

✅ **Modern UI/UX**
- Dark theme with DAW-inspired design
- Framer Motion animations
- Responsive design (mobile, tablet, desktop)
- Accessible color contrast

## Project Structure

```
Symphonia/
├── backend/
│   ├── models/          # MongoDB models (User, Project, Comment)
│   ├── routes/          # API routes
│   ├── controllers/     # Business logic
│   ├── middleware/      # Authentication middleware
│   ├── utils/           # Cloudinary, Socket.io utilities
│   └── server.js        # Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context (Auth, Socket)
│   │   ├── utils/       # API utilities
│   │   └── App.jsx      # Main app component
│   └── public/
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/collaborators` - Add collaborator
- `POST /api/projects/:id/versions` - Create new version

### Comments
- `GET /api/comments/project/:projectId` - Get comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/comments/:id/reply` - Reply to comment

### Upload
- `POST /api/upload/audio` - Upload audio file
- `POST /api/upload/project/:projectId` - Upload to project

### AI
- `POST /api/ai/suggestions` - Get AI suggestions

## Socket.io Events

### Client → Server
- `join-project` - Join project room
- `leave-project` - Leave project room
- `comment-added` - Notify new comment
- `comment-updated` - Notify comment update
- `playback-sync` - Sync playback position

### Server → Client
- `user-joined` - User joined project
- `user-left` - User left project
- `new-comment` - New comment added
- `comment-update` - Comment updated
- `playback-update` - Playback position updated

## Deployment

### Backend (Render)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy Node.js service
4. Set build command: `npm install`
5. Set start command: `npm start`

### Frontend (Vercel)
1. Import project from GitHub
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables

### MongoDB Atlas
1. Create cluster
2. Get connection string
3. Update `MONGODB_URI` in backend `.env`

### Cloudinary
1. Create account
2. Get API credentials
3. Update Cloudinary config in backend `.env`

## Troubleshooting

### Audio upload fails
- Check Cloudinary credentials
- Verify file format (MP3, WAV, M4A, AAC)
- Check file size (max 100MB)

### Socket.io not connecting
- Verify `VITE_SOCKET_URL` in frontend `.env`
- Check CORS settings in backend
- Ensure Socket.io server is running

### AI suggestions not working
- Verify OpenAI API key is set
- Check API key has credits/quota
- Review error messages in console

## Next Steps

- Add audio effects and filters
- Implement chat functionality
- Add notification system
- Create audio playlist feature
- Add analytics dashboard

