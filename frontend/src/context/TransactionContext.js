import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getTransactions, addTransaction, deleteTransaction } from '../api';

const TransactionContext = createContext();

const initialState = {
  transactions: [],
  loading: true,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'GET_TRANSACTIONS':
      return { ...state, transactions: action.payload, loading: false };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t._id !== action.payload),
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch all transactions on mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await getTransactions();
      dispatch({ type: 'GET_TRANSACTIONS', payload: res.data.data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch transactions' });
    }
  };

  const addNewTransaction = async (formData) => {
    try {
      const res = await addTransaction(formData);
      dispatch({ type: 'ADD_TRANSACTION', payload: res.data.data });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to add transaction' };
    }
  };

  const removeTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete transaction' });
    }
  };

  // Computed values
  const income = state.transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = state.transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  return (
    <TransactionContext.Provider
      value={{
        ...state,
        income,
        expense,
        balance,
        addNewTransaction,
        removeTransaction,
        fetchTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);