import express from 'express';
import { getAttendees, createAttendee, updateAttendee, deleteAttendee } from '../controllers/attendeeController.js';
const router = express.Router();
router.get('/', getAttendees);
router.post('/', createAttendee);
router.put('/:id', updateAttendee);
router.delete('/:id', deleteAttendee);
export default router;