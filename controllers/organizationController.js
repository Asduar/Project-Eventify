import Organization from '../models/Organization.js';

export const getOrganizations = async (req, res) => {
    try {
        const data = await Organization.findAll();
        res.json(data);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

export const createOrganization = async (req, res) => {
    try {
        const newData = await Organization.create(req.body);
        res.status(201).json(newData);
    } catch (error) { res.status(400).json({ message: error.message }); }
};