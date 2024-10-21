const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Create expense
router.post('/', (req, res) => {
    const { type, name, amount, date } = req.body;
    const query = 'INSERT INTO expenses (type, name, amount, date) VALUES (?, ?, ?, ?)';
    db.query(query, [type, name, amount, date], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId, type, name, amount, date });
    });
});

// Get all expenses
router.get('/', (req, res) => {
    const query = 'SELECT * FROM expenses';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Update expense
router.put('/:id', (req, res) => {
    const { type, name, amount, date } = req.body;
    const query = 'UPDATE expenses SET type = ?, name = ?, amount = ?, date = ? WHERE id = ?';
    db.query(query, [type, name, amount, date, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: req.params.id, type, name, amount, date });
    });
});

// Delete expense
router.delete('/:id', (req, res) => {
    const query = 'DELETE FROM expenses WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(204).send();
    });
});

module.exports = router;
