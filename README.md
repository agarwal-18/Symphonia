# Symphonia 🎵

A modern music collaboration platform for musicians and producers to upload, share, and collaborate on audio tracks in real-time.

## Features

- 🎤 Upload instrumental stems or songs (MP3/WAV)
- 📊 Visualize audio with Wavesurfer.js
- 💬 Add timestamp-based comments
- 🔄 Manage project versions (like GitHub for audio)
- ⚡ Real-time collaboration with Socket.io
- 🤖 AI-based suggestions for mixing or composition

## Tech Stack

### Frontend
- React (Vite)
- TailwindCSS
- Framer Motion
- Wavesurfer.js
- Axios
- React Router DOM

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT + bcrypt (authentication)
- Socket.io (real-time)
- Multer (file uploads)

### Storage & Services
- Cloudinary (audio files)
- MongoDB Atlas
- OpenAI API (AI suggestions)

## Getting Started

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OPENAI_API_KEY=your_openai_key
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## Project Structure

```
Symphonia/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── utils/
│   └── public/
└── README.md
```
