
// How we specify the application state changes in response to certain actions to our context.
export default (state, action) => {
  switch(action.type) {
    case 'GET_TRANSACTIONS':
      return {
        ...state,
        loading: false,
        transactions: action.payload
      }
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction._id !== action.payload)
      }
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload]
      }
    case 'TRANSACTION_ERROR':
      return {
        ...state,
        error: action.payload
      }
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(transaction =>
          transaction._id === action.payload._id ? action.payload : transaction
        )
      };
    case 'SET_USER':
      return {
          ...state,
          user: action.payload, // Update the user data in the state
      };

    case 'LOGOUT':
      return {
        ...state, // Reset the state to the initial state
        transactions: [] // Clear specific state data if needed
      };
    default:
      return state;
  }
}