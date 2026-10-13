const express = require('express');
const router = express.Router();
const { getAllCustomers, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAllCustomers);
router.post('/', authMiddleware, createCustomer);
router.put('/:id', authMiddleware, updateCustomer);
router.delete('/:id', authMiddleware, deleteCustomer);

module.exports = router;
