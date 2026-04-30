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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/events', eventRoutes);
app.use('/users', userRoutes);
app.use('/organizations', organizationRoutes);
app.use('/rooms', roomRoutes);
app.use('/attendees', attendeeRoutes);

const initializeApp = async () => {
    try {
        await db.authenticate();
        console.log('Koneksi ke MySQL Workbench berhasil!');
        await db.sync({ force: true }); 
        console.log('Tabel database berhasil disinkronisasi.');

        app.get('/', (req, res) => {
            res.send('Server Eventify Berjalan dengan Baik!');
        });

        app.listen(PORT, () => {
            console.log(`Server berjalan di http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Gagal menghubungkan ke database:', error);
    }
};

initializeApp();