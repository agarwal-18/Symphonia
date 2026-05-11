import Comment from '../models/Comment.js';
import Project from '../models/Project.js';

export const createComment = async (req, res) => {
  try {
    const { projectId, timestamp, text, audioFileId } = req.body;

    // Verify project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const comment = new Comment({
      project: projectId,
      user: req.user._id,
      timestamp,
      text,
      audioFileId: audioFileId || null
    });

    await comment.save();
    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'username avatar');

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const { projectId } = req.params;

    const comments = await Comment.find({ project: projectId })
      .populate('user', 'username avatar')
      .populate('replies.user', 'username avatar')
      .sort({ timestamp: 1 });

    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const replyToComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.replies.push({
      user: req.user._id,
      text
    });

    await comment.save();
    const updatedComment = await Comment.findById(commentId)
      .populate('user', 'username avatar')
      .populate('replies.user', 'username avatar');

    res.json(updatedComment);
  } catch (error) {
    console.error('Reply to comment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text, resolved } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the owner
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (text) comment.text = text;
    if (resolved !== undefined) comment.resolved = resolved;

    await comment.save();
    const updatedComment = await Comment.findById(commentId)
      .populate('user', 'username avatar')
      .populate('replies.user', 'username avatar');

    res.json(updatedComment);
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the owner or project owner
    const project = await Project.findById(comment.project);
    const isOwner = comment.user.toString() === req.user._id.toString() ||
      project?.owner.toString() === req.user._id.toString();

    if (!isOwner) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
