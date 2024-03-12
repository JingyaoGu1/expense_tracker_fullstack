const express = require('express');
const router = express.Router();
const { getTransactions, addTransaction, deleteTransaction, updateTransaction } = require('../controllers/transactions');

const { protect } = require('../middleware/authMiddleware')
router
  .route('/')
  .get(protect, getTransactions)
  .post(protect, addTransaction);

router
  .route('/:id')
  .delete(protect, deleteTransaction);

router
  .put('/:id',protect, updateTransaction);

module.exports = router; 