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

export const updateOrganization = async (req, res) => {
    try {
        await Organization.update(req.body, { where: { id: req.params.id } });
        res.json({ message: 'Organisasi berhasil diperbarui' });
    } catch (error) { res.status(400).json({ message: error.message }); }
};

export const deleteOrganization = async (req, res) => {
    try {
        await Organization.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Organisasi berhasil dihapus' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};