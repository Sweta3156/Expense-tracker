import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { useTransactions } from '../context/TransactionContext';

const COLORS = {
  Food: '#FF6B6B', Transport: '#4ECDC4', Shopping: '#45B7D1',
  Entertainment: '#96CEB4', Health: '#FFEAA7', Salary: '#6C5CE7',
  Freelance: '#00B894', Investment: '#FDCB6E', Other: '#A29BFE',
};

const formatINR = (value) => `₹${value.toLocaleString('en-IN')}`;

const Charts = () => {
  const { transactions, income, expense } = useTransactions();

  // Category breakdown for expenses
  const categoryData = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find((item) => item.name === t.category);
      if (existing) existing.value += t.amount;
      else acc.push({ name: t.category, value: t.amount });
      return acc;
    }, []);

  // Monthly bar chart data (last 6 months)
  const monthlyData = (() => {
    const months = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('en-IN', { month: 'short', year: '2-digit' });
      months[key] = { month: key, income: 0, expense: 0 };
    }
    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = d.toLocaleString('en-IN', { month: 'short', year: '2-digit' });
      if (months[key]) months[key][t.type] += t.amount;
    });
    return Object.values(months);
  })();

  return (
    <div className="charts-section">
      {/* Income vs Expense Bar Chart */}
      <div className="card chart-card">
        <h2 className="card-title">Monthly Overview</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => formatINR(value)} />
            <Legend />
            <Bar dataKey="income" fill="#00B894" radius={[4, 4, 0, 0]} name="Income" />
            <Bar dataKey="expense" fill="#FF6B6B" radius={[4, 4, 0, 0]} name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Expense Category Pie Chart */}
      {categoryData.length > 0 && (
        <div className="card chart-card">
          <h2 className="card-title">Expense Breakdown</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#A29BFE'} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatINR(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Charts;