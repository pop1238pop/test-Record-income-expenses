const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/expenses', expenseRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.delete('/api/expenses/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM expenses WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(204).send();
    });
});

// ปรับปรุงรายการ
app.put('/api/expenses/:id', (req, res) => {
    const id = req.params.id;
    const { name, amount, date, type } = req.body;

    db.query(
        'UPDATE expenses SET name = ?, amount = ?, date = ?, type = ? WHERE id = ?',
        [name, amount, date, type, id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.json({ message: 'Updated successfully!' });
        }
    );
});

// ค้นหาตามเดือน
app.get('/api/expenses/month/:month', (req, res) => {
    const month = req.params.month;

    db.query('SELECT * FROM expenses WHERE MONTH(date) = ?', [month], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

// แสดงรายงานตามเดือน
app.get('/api/report/month/:month', (req, res) => {
    const month = req.params.month;

    db.query(`
        SELECT 
            SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END) AS total_income,
            SUM(CASE WHEN type = 'Expense' THEN amount ELSE 0 END) AS total_expense
        FROM expenses
        WHERE MONTH(date) = ?`, [month], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        const total_income = results[0].total_income || 0;
        const total_expense = results[0].total_expense || 0;
        const balance = total_income - total_expense;

        res.json({
            total_income,
            total_expense,
            balance,
        });
    });
});

