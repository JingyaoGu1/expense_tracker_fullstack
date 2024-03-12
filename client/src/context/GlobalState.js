import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';
import axios from 'axios';

// Initial state
const initialState = {
  transactions: [],
  user: null,
  isLoggedIn: false
}

// Create context
export const GlobalContext = createContext(initialState);

// Provider component that wraps around all other components, providing state and actions to its children.
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);


    // Function to get token from storage
  const getToken = () => {
    const token = localStorage.getItem('token');
    return token;
  };

  const setUser = (user) => {
    dispatch({
      type: 'SET_USER',
      payload: user
    });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null); 
    dispatch({
      type: 'LOGOUT'
    });
  };
  

  // Actions
  async function getTransactions() {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    }
    try {
      const res = await axios.get('/api/v1/transactions', config);

      dispatch({
        type: 'GET_TRANSACTIONS',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.error
      });
    }
  }

  async function deleteTransaction(id) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    }
    try {
      await axios.delete(`/api/v1/transactions/${id}`, config);

      dispatch({
        type: 'DELETE_TRANSACTION',
        payload: id
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.error
      });
    }
  }

  async function editTransaction(id, newText, newAmount) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    }
    try {
      const res = await axios.put(`/api/v1/transactions/${id}`, {
        text: newText,
        amount: newAmount
      }, config);
      
      dispatch({
        type: 'EDIT_TRANSACTION',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.error
      });
    }
  }


  async function addTransaction(transaction) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    }

    try {
      const res = await axios.post('/api/v1/transactions', transaction, config);

      dispatch({
        type: 'ADD_TRANSACTION',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.error
      });
    }
  }

  return (<GlobalContext.Provider value={{
    transactions: state.transactions,
    error: state.error,
    loading: state.loading,
    user: state.user,
    getTransactions,
    deleteTransaction,
    addTransaction,
    editTransaction,
    setUser,  // Expose setUser
    logout    // Expose logout
  }}>
    {children}
  </GlobalContext.Provider>);
}