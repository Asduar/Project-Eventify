import User from '../models/User.js';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const newUser = await User.create({ username, email, password });
        
        res.status(201).json({ 
            message: 'Registrasi berhasil!', 
            user: { id: newUser.id, username: newUser.username } 
        });
    } catch (error) {
        res.status(400).json({ message: 'Gagal registrasi: Email mungkin sudah digunakan.' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email: email } });

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

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'createdAt']
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};