import express from 'express';
import { 
    getAllEvents, 
    getEventById, 
    createEvent, 
    updateEvent, 
    deleteEvent 
} from '../controllers/eventController.js';

const router = express.Router();

// Memenuhi syarat Modul M05: HTTP Method & Routing
router.get('/', getAllEvents);          // GET: Ambil semua data
router.get('/:id', getEventById);       // GET: Ambil data spesifik
router.post('/', createEvent);          // POST: Tambah data baru
router.put('/:id', updateEvent);        // PUT: Update data
router.delete('/:id', deleteEvent);     // DELETE: Hapus data

export default router;