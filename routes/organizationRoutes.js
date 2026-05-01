import express from 'express';
import { getOrganizations, createOrganization, updateOrganization, deleteOrganization } from '../controllers/organizationController.js';
const router = express.Router();
router.get('/', getOrganizations);
router.post('/', createOrganization);
router.put('/:id', updateOrganization);
router.delete('/:id', deleteOrganization);
export default router;