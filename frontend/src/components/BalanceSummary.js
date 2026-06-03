import React from 'react';
import { useTransactions } from '../context/TransactionContext';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

const BalanceSummary = () => {
  const { balance, income, expense } = useTransactions();

  return (
    <div className="balance-summary">
      <div className="balance-card total">
        <p className="label">Total Balance</p>
        <h1 className={`amount ${balance >= 0 ? 'positive' : 'negative'}`}>
          {formatCurrency(balance)}
        </h1>
      </div>
      <div className="summary-row">
        <div className="balance-card income">
          <p className="label">💰 Income</p>
          <h2 className="amount positive">{formatCurrency(income)}</h2>
        </div>
        <div className="balance-card expense">
          <p className="label">💸 Expenses</p>
          <h2 className="amount negative">{formatCurrency(expense)}</h2>
        </div>
      </div>
    </div>
  );
};

export default BalanceSummary;