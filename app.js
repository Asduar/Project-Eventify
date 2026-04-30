import express from 'express';
import db from './config/database.js';
import User from './models/User.js';
import Event from './models/Event.js';
import eventRoutes from './routes/eventRoutes.js';
import userRoutes from './routes/userRoutes.js';
import organizationRoutes from './routes/organizationRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import attendeeRoutes from './routes/attendeeRoutes.js';
import Organization from './models/Organization.js';
import Room from './models/Room.js';
import Attendee from './models/Attendee.js';


const app = express();
const PORT = 3000;

// Middleware untuk memparsing JSON (Memenuhi syarat M05: Content-Type)
app.use(express.json());
// Middleware untuk memparsing data dari form (URL-encoded)
app.use(express.urlencoded({ extended: true }));
// Middleware untuk menyajikan file statis (HTML, CSS, JS di folder public)
app.use(express.static('public'));
app.use('/events', eventRoutes);
// Mendaftarkan routing user
app.use('/users', userRoutes);
app.use('/organizations', organizationRoutes);
app.use('/rooms', roomRoutes);
app.use('/attendees', attendeeRoutes);

// Memenuhi syarat M03: Asynchronous Programming (async/await)
const initializeApp = async () => {
    try {
        // Menguji koneksi database
        await db.authenticate();
        console.log('Koneksi ke MySQL Workbench berhasil!');

        // Sinkronisasi model dengan database (membuat tabel otomatis jika belum ada)
        // Hati-hati: jangan gunakan alter: true di production, tapi aman untuk UTS/development
        await db.sync({ alter: true }); 
        console.log('Tabel database berhasil disinkronisasi.');

        // Rute Dasar (Testing)
        app.get('/', (req, res) => {
            res.send('Server Eventify Berjalan dengan Baik!');
        });

        // Menjalankan Server
        app.listen(PORT, () => {
            console.log(`Server berjalan di http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Gagal menghubungkan ke database:', error);
    }
};

// Jalankan inisialisasi
initializeApp();