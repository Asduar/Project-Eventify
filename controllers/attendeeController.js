import Attendee from '../models/Attendee.js';
import Organization from '../models/Organization.js';
import Event from '../models/Event.js';

export const getAttendees = async (req, res) => {
    try {
        const attendees = await Attendee.findAll({
            include: [{ model: Event, attributes: ['title'] }]
        });
        res.json(attendees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createAttendee = async (req, res) => {
    try {
        const newData = await Attendee.create(req.body);
        res.status(201).json(newData);
    } catch (error) { res.status(400).json({ message: error.message }); }
};

export const updateAttendee = async (req, res) => {
    try {
        await Attendee.update(req.body, { where: { id: req.params.id } });
        res.json({ message: 'Peserta berhasil diperbarui' });
    } catch (error) { res.status(400).json({ message: error.message }); }
};

export const deleteAttendee = async (req, res) => {
    try {
        await Attendee.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Peserta berhasil dihapus' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};