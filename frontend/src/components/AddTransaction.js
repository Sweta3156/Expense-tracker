import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Other'],
  expense: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Other'],
};

const AddTransaction = () => {
  const { addNewTransaction } = useTransactions();
  const [form, setForm] = useState({
    text: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      // Reset category when type changes
      ...(name === 'type' && { category: CATEGORIES[value][0] }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.text || !form.amount) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    const result = await addNewTransaction({
      ...form,
      amount: parseFloat(form.amount),
    });
    if (result.success) {
      setForm({
        text: '',
        amount: '',
        type: 'expense',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
      });
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h2 className="card-title">Add Transaction</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit} className="transaction-form">
        {/* Type Toggle */}
        <div className="type-toggle">
          <button
            type="button"
            className={`toggle-btn ${form.type === 'income' ? 'active income' : ''}`}
            onClick={() => setForm((p) => ({ ...p, type: 'income', category: 'Salary' }))}
          >
            + Income
          </button>
          <button
            type="button"
            className={`toggle-btn ${form.type === 'expense' ? 'active expense' : ''}`}
            onClick={() => setForm((p) => ({ ...p, type: 'expense', category: 'Food' }))}
          >
            − Expense
          </button>
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            name="text"
            value={form.text}
            onChange={handleChange}
            placeholder="e.g. Monthly salary, Grocery shopping..."
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>Category</label>
          <select name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES[form.type].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;