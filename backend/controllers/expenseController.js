const Expense = require('../models/Expense');

exports.createExpense = async (req, res) => {
  try {
    const amount = parseFloat(req.body.amount) || 0;
    if (amount <= 0) return res.status(400).json({ success: false, error: 'Amount must be greater than zero.' });

    const expense = new Expense({
      ...req.body,
      amount
    });
    await expense.save();
    res.status(201).json({ success: true, message: 'Expense saved', data: expense });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1, createdAt: -1 });
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!expense) return res.status(404).json({ success: false, error: 'Not found' });
    res.status(200).json({ success: true, message: 'Expense updated', data: expense });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ success: false, error: 'Not found' });
    res.status(200).json({ success: true, message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
