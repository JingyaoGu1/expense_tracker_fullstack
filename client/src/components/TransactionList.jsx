import React, { useContext, useEffect, useState } from 'react';
import { Transaction } from './Transaction';
import { GlobalContext } from '../context/GlobalState';

export const TransactionList = () => {
  const { transactions, user } = useContext(GlobalContext);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [selectedDate, setSelectedDate] = useState('');
  const [filterByWeek, setFilterByWeek] = useState(false);
  const [expandAll, setExpandAll] = useState(false); // New state for expand/collapse



  useEffect(() => {
    const uniqueCategories = [...new Set(transactions.map(transaction => transaction.category))];
    setCategories(['All', ...uniqueCategories]);
  }, [transactions, user]);

  const getStartAndEndOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(d.setDate(diff));
    const endOfWeek = new Date(d.setDate(diff + 6));
    return { startOfWeek, endOfWeek };
  }

  const sortedTransactions = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredTransactions = transactions
    .filter(transaction => selectedCategory === 'All' || transaction.category === selectedCategory)
    .filter(transaction => {
      if (!selectedDate) return true;
      if (filterByWeek) {
        const { startOfWeek, endOfWeek } = getStartAndEndOfWeek(selectedDate);
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
      }
      
      return new Date(transaction.date).toDateString() === new Date(selectedDate).toDateString();
    }).slice(0, expandAll ? sortedTransactions.length : 5);;

  return (
    <>
      <h3>History</h3>

      <button onClick={() => setExpandAll(!expandAll)}>
        {expandAll ? 'Collapse' : 'Expand All'}
      </button>

      <div className="filter-row">
        <label htmlFor="categoryFilter">Filter by Category: </label>
        <select
          id="categoryFilter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => <option key={category} value={category}>{category}</option>)}
        </select>
      </div>

      <div className="filter-row">
        <label htmlFor="dateFilter">Filter by Date: </label>
        <input
          type="date"
          id="dateFilter"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={filterByWeek}
            onChange={() => setFilterByWeek(!filterByWeek)}
          />
          Filter by Week
        </label>
      </div>

      <ul className="list">
        {filteredTransactions.map(transaction => <Transaction key={transaction._id} transaction={transaction} />)}
      </ul>
    </>
  );
};