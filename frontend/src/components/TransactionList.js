import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const CATEGORY_ICONS = {
  Food: '🍔', Transport: '🚗', Shopping: '🛍️', Entertainment: '🎬',
  Health: '💊', Salary: '💼', Freelance: '💻', Investment: '📈', Other: '📦',
};

const TransactionList = () => {
  const { transactions, loading, removeTransaction } = useTransactions();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = transactions
    .filter((t) => filter === 'all' || t.type === filter)
    .filter((t) => t.text.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="card loading">Loading transactions...</div>;

  return (
    <div className="card">
      <h2 className="card-title">Transaction History</h2>

      {/* Search & Filter */}
      <div className="list-controls">
        <input
          type="text"
          placeholder="🔍 Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <div className="filter-tabs">
          {['all', 'income', 'expense'].map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">No transactions found.</p>
      ) : (
        <ul className="transaction-list">
          {filtered.map((t) => (
            <li key={t._id} className={`transaction-item ${t.type}`}>
              <div className="t-icon">{CATEGORY_ICONS[t.category] || '📦'}</div>
              <div className="t-info">
                <span className="t-text">{t.text}</span>
                <span className="t-meta">{t.category} • {formatDate(t.date)}</span>
              </div>
              <div className="t-right">
                <span className={`t-amount ${t.type}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => removeTransaction(t._id)}
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionList;