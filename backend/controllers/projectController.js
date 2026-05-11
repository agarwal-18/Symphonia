import Project from '../models/Project.js';
import User from '../models/User.js';

export const createProject = async (req, res) => {
  try {
    const { title, description, tags, isPublic } = req.body;

    const project = new Project({
      title,
      description,
      owner: req.user._id,
      tags: tags || [],
      isPublic: isPublic || false,
      versions: [{
        versionNumber: 1,
        audioFiles: [],
        createdBy: req.user._id
      }]
    });

    await project.save();

    // Add project to user's projects
    await User.findByIdAndUpdate(req.user._id, {
      $push: { projects: project._id }
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const { userId, publicOnly } = req.query;
    let query = {};

    if (publicOnly === 'true') {
      query.isPublic = true;
    } else if (userId) {
      query.$or = [
        { owner: userId },
        { 'collaborators.user': userId }
      ];
    } else {
      // Get user's own projects and collaborations
      query.$or = [
        { owner: req.user._id },
        { 'collaborators.user': req.user._id }
      ];
    }

    const projects = await Project.find(query)
      .populate('owner', 'username avatar')
      .populate('collaborators.user', 'username avatar')
      .sort({ updatedAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'username avatar')
      .populate('collaborators.user', 'username avatar')
      .populate('versions.createdBy', 'username avatar');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check access
    const hasAccess = project.owner._id.toString() === req.user._id.toString() ||
      project.collaborators.some(c => c.user._id.toString() === req.user._id.toString()) ||
      project.isPublic;

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only owner can update project' });
    }

    const { title, description, tags, isPublic } = req.body;

    if (title) project.title = title;
    if (description !== undefined) project.description = description;
    if (tags) project.tags = tags;
    if (isPublic !== undefined) project.isPublic = isPublic;

    await project.save();
    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only owner can delete project' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addCollaborator = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only owner can add collaborators' });
    }

    // Check if already a collaborator
    if (project.collaborators.some(c => c.user.toString() === userId)) {
      return res.status(400).json({ message: 'User is already a collaborator' });
    }

    project.collaborators.push({
      user: userId,
      role: role || 'viewer'
    });

    await project.save();

    // Add to user's collaborations
    await User.findByIdAndUpdate(userId, {
      $push: { collaborations: project._id }
    });

    const updatedProject = await Project.findById(req.params.id)
      .populate('collaborators.user', 'username avatar');

    res.json(updatedProject);
  } catch (error) {
    console.error('Add collaborator error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createVersion = async (req, res) => {
  try {
    const { description, audioFiles } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check access
    const hasAccess = project.owner._id.toString() === req.user._id.toString() ||
      project.collaborators.some(c => 
        c.user._id.toString() === req.user._id.toString() && 
        ['editor', 'viewer'].includes(c.role)
      );

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const newVersionNumber = project.currentVersion + 1;

    project.versions.push({
      versionNumber: newVersionNumber,
      audioFiles: audioFiles || [],
      description,
      createdBy: req.user._id
    });

    project.currentVersion = newVersionNumber;
    await project.save();

    const updatedProject = await Project.findById(req.params.id)
      .populate('versions.createdBy', 'username avatar');

    res.status(201).json(updatedProject);
  } catch (error) {
    console.error('Create version error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
