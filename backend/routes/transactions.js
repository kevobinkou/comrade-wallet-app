const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// 1. POST: Add a new transaction
router.post('/add', async (req, res) => {
    try {
        console.log("Data received from React:", req.body); 
        const newTransaction = new Transaction(req.body);
        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (err) {
        console.error("Database Save Error:", err.message);
        res.status(400).json({ message: err.message });
    }
});

// 2. GET: Fetch all transactions (The New History Route)
router.get('/all', async (req, res) => {
    try {
        // We sort by date (-1) so the newest transactions appear at the top
        const transactions = await Transaction.find().sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// DELETE: Remove a transaction by ID
router.delete('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });
        res.json({ message: "Transaction deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// 3. GET: Fetch financial summary (Totals)
router.get('/summary', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        let income = 0;
        let expenses = 0;

        transactions.forEach(trans => {
            if (trans.type === 'income') income += trans.amount;
            else expenses += trans.amount;
        });

        res.json({
            totalIncome: income,
            totalExpenses: expenses,
            balance: income - expenses
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;