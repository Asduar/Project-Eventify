import Event from '../models/Event.js';

export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getEventById = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event tidak ditemukan' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createEvent = async (req, res) => {
    try {
        const newEvent = await Event.create(req.body);
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const updated = await Event.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated[0] === 0) return res.status(404).json({ message: 'Event tidak ditemukan' });
        res.json({ message: 'Jadwal Event berhasil diperbarui' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const deleted = await Event.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) return res.status(404).json({ message: 'Event tidak ditemukan' });
        res.json({ message: 'Jadwal Event berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};