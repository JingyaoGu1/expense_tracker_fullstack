import React from 'react';
import { Header } from './components/Header';
import { Balance } from './components/Balance';
import { IncomeExpenses } from './components/IncomeExpenses';
import { TransactionList } from './components/TransactionList';
import { AddTransaction } from './components/AddTransaction';
import { LineCharts } from './components/LineCharts';
import { TransactionCharts } from './components/TransactionCharts';

import { GlobalProvider } from './context/GlobalState';

import './App.css';

function App() {
  return (
    <GlobalProvider>
      <Header /> {/* Positioned as a navbar */}
      <div className="main-layout">
        <div className="container">
          <Balance />
          <IncomeExpenses />
          <TransactionList />
          <AddTransaction />
        </div>
        <div className='right-container'>
          <TransactionCharts />
          <LineCharts />
        </div>
      </div>
    </GlobalProvider>
  );
}



export default App;