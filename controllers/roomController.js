import Room from '../models/Room.js';

export const getRooms = async (req, res) => {
    try {
        const data = await Room.findAll();
        res.json(data);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

export const createRoom = async (req, res) => {
    try {
        const newData = await Room.create(req.body);
        res.status(201).json(newData);
    } catch (error) { res.status(400).json({ message: error.message }); }
};

export const updateRoom = async (req, res) => {
    try {
        await Room.update(req.body, { where: { id: req.params.id } });
        res.json({ message: 'Ruangan berhasil diperbarui' });
    } catch (error) { res.status(400).json({ message: error.message }); }
};

export const deleteRoom = async (req, res) => {
    try {
        await Room.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Ruangan berhasil dihapus' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};