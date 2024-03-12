const Transaction = require('../models/Transaction');
const Users = require('../models/User');

// @desc    Get all transactions
// @route   GET /api/v1/transactions
// @access  Public
exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({user: req.user.id});

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}

// @desc    Add transaction
// @route   POST /api/v1/transactions
// @access  Private
exports.addTransaction = async (req, res, next) => {
  try {
    const { text, amount} = req.body;
    const userId = req.user.id;  // Assuming req.user.id is the correct way to get the user ID

    // Create a new transaction object including the user's ID
    const transactionData = {
      user: userId, 
      text,
      amount,
      // date,
      // category,
    };

    const transaction = await Transaction.create(transactionData);
  
    return res.status(201).json({
      success: true,
      data: transaction
    }); 
  } catch (err) {
    if(err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);

      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
}

// @desc    Delete transaction
// @route   DELETE /api/v1/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if(!transaction) {
      return res.status(404).json({
        success: false,
        error: 'No transaction found'
      });
    }
    // Check for user
    if (!req.user) {
      res.status(401)
      throw new Error('User not found')
    }
    // Make sure the logged in user matches the goal user
    if (transaction.user.toString() !== req.user.id) {
      res.status(401)
      throw new Error('User not authorized')
    }
    await transaction.remove();

    return res.status(200).json({
      success: true,
      data: {}
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}

exports.updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text, amount } = req.body;
    
    // Find the transaction by ID and update it
    let transaction = await Transaction.findById(id);
    
    if(!transaction) {
      return res.status(404).json({
        success: false,
        error: 'No transaction found'
      });
    }
    // Check for user
    if (!req.user) {
      res.status(401)
      throw new Error('User not found')
    }
    // Make sure the logged in user matches the goal user
    if (transaction.user.toString() !== req.user.id) {
      res.status(401)
      throw new Error('User not authorized')
    }

    transaction.text = text;
    transaction.amount = amount;

    await transaction.save();

    return res.status(200).json({
      success: true,
      data: transaction
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}