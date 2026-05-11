import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { upload, uploadToCloudinary } from '../utils/cloudinary.js';
import Project from '../models/Project.js';

const router = express.Router();

router.use(authenticate);

router.post('/audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No audio file provided' });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    // Get file format from original filename or MIME type
    const format = req.file.originalname.split('.').pop().toLowerCase();
    
    const audioFile = {
      filename: result.public_id,
      originalName: req.file.originalname,
      url: result.secure_url,
      cloudinaryId: result.public_id,
      format: format,
      size: req.file.size,
      duration: 0 // Duration will be calculated on frontend
    };

    res.status(200).json({
      message: 'File uploaded successfully',
      file: audioFile
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

router.post('/project/:projectId', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No audio file provided' });
    }

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check access
    const hasAccess = project.owner.toString() === req.user._id.toString() ||
      project.collaborators.some(c => 
        c.user.toString() === req.user._id.toString() && 
        ['editor', 'viewer'].includes(c.role)
      );

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    const format = req.file.originalname.split('.').pop().toLowerCase();
    
    const audioFile = {
      filename: result.public_id,
      originalName: req.file.originalname,
      url: result.secure_url,
      cloudinaryId: result.public_id,
      format: format,
      size: req.file.size,
      duration: 0
    };

    // Add to current version
    const currentVersion = project.versions.find(v => v.versionNumber === project.currentVersion);
    if (currentVersion) {
      currentVersion.audioFiles.push(audioFile);
      await project.save();
    }

    res.status(200).json({
      message: 'File uploaded to project successfully',
      file: audioFile,
      project
    });
  } catch (error) {
    console.error('Project upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

export default router;
