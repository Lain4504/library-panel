const authorRepository = require('../repositories/authorRepository');

const authorController = {
    createAuthor: async (req, res) => {
        try {
            const author = await authorRepository.create(req.body);
            res.status(201).json(author);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAllAuthors: async (req, res) => {
        try {
            const authors = await authorRepository.findAll();
            res.json(authors);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAuthorById: async (req, res) => {
        try {
            const author = await authorRepository.findById(req.params.id);
            if (!author) {
                return res.status(404).json({ error: 'Author not found' });
            }
            res.json(author);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateAuthor: async (req, res) => {
        try {
            const updatedAuthor = await authorRepository.update(req.params.id, req.body);
            if (!updatedAuthor) {
                return res.status(404).json({ error: 'Author not found' });
            }
            res.json(updatedAuthor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteAuthor: async (req, res) => {
        try {
            const deletedAuthor = await authorRepository.delete(req.params.id);
            if (!deletedAuthor) {
                return res.status(404).json({ error: 'Author not found' });
            }
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = authorController;