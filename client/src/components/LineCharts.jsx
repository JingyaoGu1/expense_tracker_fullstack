import React, { useContext, useState, useMemo} from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area } from 'recharts';
import { GlobalContext } from '../context/GlobalState';

export const LineCharts = () => {
  const { transactions } = useContext(GlobalContext);
  const [timeFrame, setTimeFrame] = useState('Daily');
  const [fiscalYear, setFiscalYear] = useState(new Date().getFullYear()); // State for fiscal year selection

  const filterTransactionsByTimeFrame = useMemo(() => {
    let filteredTransactions = [];

    const filterTransactionsByFiscalYear = (transaction) => {
      const transactionDate = new Date(transaction.date);
  const startOfYear = new Date(parseInt(fiscalYear), 0, 1); // January 1 of the selected fiscal year
  const endOfYear = new Date(parseInt(fiscalYear) + 1, 0, 1);
      return transactionDate >= startOfYear && transactionDate < endOfYear;
    };

    // Assuming transaction.date is a string in 'YYYY-MM-DD' format
    const expenseTransactions = transactions.filter(transaction => transaction.amount < 0);
    const filteredByYear = expenseTransactions.filter(filterTransactionsByFiscalYear);

    const getWeekLabel = (date) => {
      // Find the start of the week based on the date
      const startOfWeek = new Date(date);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + (startOfWeek.getDay() === 0 ? -6 : 1));
      return `Week of ${startOfWeek.toLocaleString('default', { month: 'short' })} ${startOfWeek.getDate()}`;
    };

    const grouped = filteredByYear.reduce((acc, transaction) => {
      const date = new Date(transaction.date);

      let key;
      switch (timeFrame) {
        case 'Weekly':
          // You can adjust to define a week, e.g., by ISO week number
          key = getWeekLabel(date);
          break;
        case 'Monthly':
          key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`; // YYYY-MM format
          break;
        default:
          // key = transaction.date; // Daily
          key = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      }

      acc[key] = (acc[key] || 0) + Math.abs(transaction.amount);
      return acc;
    }, {});

    Object.keys(grouped).forEach(key => {
      filteredTransactions.push({ name: key, amount: grouped[key] });
    });

    return filteredTransactions.sort((a, b) => a.name.localeCompare(b.name)); // Sort by date
  }, [transactions, timeFrame, fiscalYear]);

  return (
    <div>
      {/* <h3>Spend Summary</h3> */}
      <h3>SPEND SUMMARY FISCAL YEAR:  {fiscalYear}-{parseInt(fiscalYear) + 1}</h3>
      <select value={fiscalYear} onChange={(e) => setFiscalYear(e.target.value)}>
        <option value="2020">2020-2021</option>
        <option value="2021">2021-2022</option>
        <option value="2022">2022-2023</option>
        <option value="2023">This Year</option>
      </select>
      <select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
        <option value="Daily">Daily</option>
        <option value="Weekly">Weekly</option>
        <option value="Monthly">Monthly</option>
      </select>
      <ResponsiveContainer width="80%" height={400}>
        <LineChart
          data={filterTransactionsByTimeFrame}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#8884d8" />
          <YAxis stroke="#8884d8" />
          <Tooltip 
            wrapperStyle={{ backgroundColor: "#8884d8", borderColor: "#ddd" }} 
            contentStyle={{ color: "#fff" }} 
            cursor={false} 
          />
          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="#82ca9d" 
            fillOpacity={0.5} 
            fill="#82ca9d" /* Adjust this color if needed */
          />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="#82ca9d" 
            strokeWidth={2} 
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};