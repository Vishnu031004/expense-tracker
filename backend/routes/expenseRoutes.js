const express = require('express');
const db = require('../db');
const router = express.Router();

// Add Expense
router.post('/add', (req, res) => {
    const { user_id, amount, category, description, expense_date } = req.body;
    
    const query = 'INSERT INTO expenses (user_id, amount, category, description, expense_date) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [user_id, amount, category, description, expense_date], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to add expense' });
        }
        res.json({ message: 'Expense added successfully', expenseId: result.insertId });
    });
});

// Get All Expenses
router.get('/all/:userId', (req, res) => {
    const { userId } = req.params;
    
    const query = 'SELECT * FROM expenses WHERE user_id = ? ORDER BY expense_date DESC';
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch expenses' });
        }
        res.json(results);
    });
});

// Delete Expense
router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    
    const query = 'DELETE FROM expenses WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete expense' });
        }
        res.json({ message: 'Expense deleted successfully' });
    });
});

// Get Category-wise Total
router.get('/category-total/:userId', (req, res) => {
    const { userId } = req.params;
    
    const query = 'SELECT category, SUM(amount) as total FROM expenses WHERE user_id = ? GROUP BY category';
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch data' });
        }
        res.json(results);
    });
});

module.exports = router;