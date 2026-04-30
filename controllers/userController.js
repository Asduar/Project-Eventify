import User from '../models/User.js';

// 1. REGISTER (Membuat akun baru)
export const register = async (req, res) => {
    try {
        // Menerima data dari body request
        const { username, email, password } = req.body;

        // Menyimpan user baru ke database
        const newUser = await User.create({ username, email, password });
        
        res.status(201).json({ 
            message: 'Registrasi berhasil!', 
            user: { id: newUser.id, username: newUser.username } 
        });
    } catch (error) {
        res.status(400).json({ message: 'Gagal registrasi: Email mungkin sudah digunakan.' });
    }
};

// 2. LOGIN (Verifikasi akun)
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Mencari user berdasarkan email (Metode Sequelize)
        const user = await User.findOne({ where: { email: email } });

        // Verifikasi sederhana (Catatan: Untuk UTS ini kita pakai password plain-text dulu agar fokus ke CRUD dasar, jika dosen menuntut keamanan lebih, nanti kita bisa tambahkan library 'bcrypt')
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Email atau password salah!' });
        }

        res.json({ 
            message: 'Login berhasil!', 
            user: { id: user.id, username: user.username, email: user.email } 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. READ ALL (Melihat semua pengguna yang terdaftar - Opsional untuk Admin)
export const getAllUsers = async (req, res) => {
    try {
        // Mengambil semua user, tapi tidak mengembalikan password ke response
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'createdAt']
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};