const publisherRepository = require('../repositories/publisherRepository');

const publisherController = {
    createPublisher: async (req, res) => {
        try {
            const publisher = await publisherRepository.create(req.body);
            res.status(201).json(publisher);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAllPublishers: async (req, res) => {
        try {
            const publishers = await publisherRepository.findAll();
            res.json(publishers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getPublisherById: async (req, res) => {
        try {
            const publisher = await publisherRepository.findById(req.params.id);
            if (!publisher) {
                return res.status(404).json({ error: 'Publisher not found' });
            }
            res.json(publisher);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updatePublisher: async (req, res) => {
        try {
            const updatedPublisher = await publisherRepository.update(req.params.id, req.body);
            if (!updatedPublisher) {
                return res.status(404).json({ error: 'Publisher not found' });
            }
            res.json(updatedPublisher);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deletePublisher: async (req, res) => {
        try {
            const deletedPublisher = await publisherRepository.delete(req.params.id);
            if (!deletedPublisher) {
                return res.status(404).json({ error: 'Publisher not found' });
            }
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = publisherController;