import Attendee from '../models/Attendee.js';

export const getAttendees = async (req, res) => {
    try {
        const data = await Attendee.findAll();
        res.json(data);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

export const createAttendee = async (req, res) => {
    try {
        const newData = await Attendee.create(req.body);
        res.status(201).json(newData);
    } catch (error) { res.status(400).json({ message: error.message }); }
};