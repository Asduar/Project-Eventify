import express from 'express';
import { getOrganizations, createOrganization } from '../controllers/organizationController.js';
const router = express.Router();
router.get('/', getOrganizations);
router.post('/', createOrganization);
export default router;