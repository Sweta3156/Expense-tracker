import React from 'react';
import { TransactionProvider } from './context/TransactionContext';
import BalanceSummary from './components/BalanceSummary';
import AddTransaction from './components/AddTransaction';
import TransactionList from './components/TransactionList';
import Charts from './components/Charts';
import './App.css';

function App() {
  return (
    <TransactionProvider>
      <div className="app">
        <header className="app-header">
          <div className="header-inner">
            <div className="logo">
              <span className="logo-icon">💹</span>
              <h1>ExpenseIQ</h1>
            </div>
            <p className="tagline">Smart spending. Smarter saving.</p>
          </div>
        </header>

        <main className="main-content">
          <BalanceSummary />

          <div className="grid-layout">
            <div className="left-col">
              <AddTransaction />
              <TransactionList />
            </div>
            <div className="right-col">
              <Charts />
            </div>
          </div>
        </main>

        <footer className="app-footer">
          <p>Built with MERN Stack • MongoDB • Express • React • Node.js</p>
        </footer>
      </div>
    </TransactionProvider>
  );
}

export default App;