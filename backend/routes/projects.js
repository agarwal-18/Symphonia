import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addCollaborator,
  createVersion
} from '../controllers/projectController.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.post('/:id/collaborators', addCollaborator);
router.post('/:id/versions', createVersion);

export default router;
