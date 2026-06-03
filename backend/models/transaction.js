const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: [true, 'Please specify income or expense'],
    },
    category: {
      type: String,
      enum: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Salary', 'Freelance', 'Investment', 'Other'],
      default: 'Other',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', TransactionSchema);