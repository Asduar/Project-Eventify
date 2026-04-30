import express from 'express';
import { getAttendees, createAttendee } from '../controllers/attendeeController.js';
const router = express.Router();
router.get('/', getAttendees);
router.post('/', createAttendee);
export default router;