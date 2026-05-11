import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.mongoUri);
        console.log('✅ Connected to MongoDB');
        console.log(`📍 Database: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        console.error('\n📝 To fix this error:');
        console.error('   1. Install MongoDB locally: https://www.mongodb.com/try/download/community');
        console.error('   2. OR use MongoDB Atlas: https://www.mongodb.com/cloud/atlas');
        console.error('   3. Update MONGODB_URI in your .env file');
        process.exit(1);
    }
};
