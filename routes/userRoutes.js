import express from 'express';
import { register, login, getAllUsers } from '../controllers/userController.js';

const router = express.Router();

// Memenuhi syarat Modul M05: HTTP Method & Routing
router.post('/register', register); // POST untuk mengirim data pendaftaran
router.post('/login', login);       // POST untuk mengirim data login yang sensitif
router.get('/', getAllUsers);       // GET untuk melihat daftar admin/pengurus

export default router;