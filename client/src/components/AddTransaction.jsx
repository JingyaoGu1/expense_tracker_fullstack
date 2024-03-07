import React, { useState, useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import axios from 'axios';

export const AddTransaction = () => {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState(0);
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState(''); 
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState(
    [
        "Housing",
        "Utilities",
        "Food and Groceries",
        "Transportation",
        "Healthcare",
        "Insurance",
        "Debt Repayment",
        "Education",
        "Entertainment and Leisure",
        "Savings and Investments",
        "Salary",
        "Gift",
        "Investment"
    ]); // Predefined categories
  const { addTransaction } = useContext(GlobalContext);
  const [isButtonClicked, setIsButtonClicked] = useState(false);


  // Add state for handling file upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle OCR conversion and auto-fill
  const handleConvert = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Replace with your actual upload endpoint
      const uploadResponse = await axios.post('http://localhost:5001/api/v1/transactions/api/upload', formData);
      const fileUrl = uploadResponse.data.url;

      // Replace with your actual OCR API endpoint
      const ocrResponse = await axios.post('http://localhost:5001/api/v1/transactions/api/veryfi', {
        file_url: fileUrl
      });

      // Auto-fill the form with OCR data
      setText(ocrResponse.data.vendor.name);
      setAmount(ocrResponse.data.total.toString()); // Convert to string for the input field
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to extract text. Please try again.');
    }

    setIsLoading(false);
  };

  const addNewCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories(prevCategories => [...prevCategories, newCategory]);
      setNewCategory(''); // Clear the new category input
    } else {
      console.error('Category already exists or invalid!');
    }
  };

  const onSubmit = e => {
    e.preventDefault();

    if (!text.trim() || !amount || !date.trim() || !category.trim()) {
      console.error('Please fill in all fields');
      return;
    }


    const newTransaction = {
      id: Math.floor(Math.random() * 100000000),
      text,
      amount: +amount,
      date,
      category, // Include the category in the new transaction
    }

    addTransaction(newTransaction);

    // Clear the form
    setText('');
    setAmount(0);
    setDate(today); // Reset to today's date
    setCategory(''); // Reset category
    setIsButtonClicked(true);
    setTimeout(() => setIsButtonClicked(false), 3000); // Resets after 3 seconds
  }

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Predefined suggestions for the autocomplete or this could be dynamically fetched
  const autoCompleteSuggestions = [
    'Rent/Mortgage',
    'Home Depot for Home Improvement',
    'IKEA for Furniture & Decor',
    
    // Transportation
    'Chevron Fuel',
    'Uber Ride-Sharing',
    'Jiffy Lube Vehicle Maintenance',
    "McDonald's",
    "Burger King",
    "Wendy's",
    "Taco Bell",
    "KFC",
    "Subway",
    "Dunkin' Donuts",
    "Pizza Hut",
    "Starbucks",
    "Domino's Pizza",
    "Chipotle Mexican Grill",
    "Tim Hortons",
    "Panera Bread",
    "Papa John's",
    "Sonic Drive-In",
    "Olive Garden",
    "Buffalo Wild Wings",
    "Arby's",
    "Chick-fil-A",
    "Jack in the Box",
    "Dairy Queen",
    "Hardee's",
    "Carl's Jr.",
    "Five Guys",
    "Red Lobster",
    "Applebee's",
    "IHOP (International House of Pancakes)",
    "Denny's",
    "Outback Steakhouse",
    "The Cheesecake Factory",
    "TGI Fridays",
    "Ruby Tuesday",
    "Cracker Barrel",
    "Golden Corral",
    "Texas Roadhouse",
    "Red Robin",
    "In-N-Out Burger",
    "Whataburger",
    "Shake Shack",
    "Little Caesars",
    "P.F. Chang's",
    "Chili's Grill & Bar",
    "LongHorn Steakhouse",
    "Carrabba's Italian Grill",
    "Ruth's Chris Steak House",
    "Waffle House",
    "Nando's",
    "Zaxby's",
    "Bojangles'",
    "Qdoba Mexican Eats",
    "El Pollo Loco",
    "Del Taco",
    "Popeyes Louisiana Kitchen",
    "Baskin-Robbins",
    "Wingstop",
    "Panda Express",
    "Moe's Southwest Grill",
    "Culver's",
    "Jimmy John's",
    "Bob Evans",
    "Steak 'n Shake",
    "Church's Chicken",
    "A&W Restaurants",
    "Sizzler",
    "Round Table Pizza",
    "Quiznos",
    "Checkers",
    "Marco's Pizza",
    "Jersey Mike's Subs",
    "Firehouse Subs",
    "Yard House",
    "Bonefish Grill",
    "Hooters",
    "Krispy Kreme",
    "Smoothie King",
    "Big Boy",
    "Pret A Manger",
    "Hard Rock Café",
    "Planet Hollywood",
    "Rainforest Cafe",
    "Maggiano's Little Italy",
    "Johnny Rockets",
    "Legal Sea Foods",
    "Fuddruckers",
    "Benihana",
    "Luby's",
    "Portillo's",
    "Primanti Brothers",
    "Wienerschnitzel",
    "The Habit Burger Grill",
    "Baja Fresh",
    "Sweetgreen",
    "Cosi",
    "Le Pain Quotidien",
    "Einstein Bros. Bagels",
    "Jamba Juice",
    "Noodles & Company",
    "Pei Wei Asian Diner",
    "Zoes Kitchen",
    "California Pizza Kitchen",
    "Boston Market",
    "Krystal",
    "White Castle",
    "Blaze Pizza",
    "MOD Pizza",
    "Caribou Coffee",
    "Au Bon Pain",
    "Corner Bakery Cafe",
    "Bareburger",
    "Shakey's Pizza",
    "The Coffee Club",
    "La Madeleine",
    "Gloria Jean's Coffees",
    "Oporto",
    "Cheeburger Cheeburger",
    "Fatburger",
    "Johnny Carino's",
    "Bruegger's Bagels",
    "Jason's Deli",
    "Schlotzsky's",
    "Five Guys Burgers and Fries",
    "Lone Star Steakhouse & Saloon",
    "Wimpy",
    "Pollo Tropical",
    "Torchy's Tacos",
    "Boudin Bakery",
    "Cook Out",
    "Uncle Maddio's Pizza",
    "Mimi's Cafe",
    "Potbelly Sandwich Shop",
    "Fazoli's",
    "Greggs",
    "Toby Carvery",
    "PizzaExpress",
    "Wagamama",
    "YO! Sushi",
    "Leon",
    "Franco Manca",
    'Verizon Phone Bill',
    'Comcast Cable Service',
    'Waste Management Trash Service',
  
    // Insurance
    'State Farm Auto Insurance',
    'Allstate Home Insurance',
  
    // Health & Wellness
    'CVS Prescription Medications',
    'GNC for Wellness Products',
    '24 Hour Fitness Gym Membership',
  
    // Personal & Family Care
    'Gap Clothing',
    'Supercuts Haircuts',
    'Merry Maids for Cleaning Service',
  
    // Debt Payments
    'Chase Credit Card Payments',
    'Navient Student Loan Payments',
  
    // Savings & Investments
    'Vanguard Retirement Fund',
  
    // Entertainment
    'Netflix Streaming Service',
    'PlayStation for Games',
    'Barnes & Noble for Books',
  
    // Travel
    'Delta Airfare',
    'Marriott Hotels',
    'Expedia Vacation Packages',
  
    // Education
    'Chegg for Textbooks',
    'Udemy Online Courses',
  
    // Subscriptions & Memberships
    'Amazon Prime Subscription',
    'Adobe Software Subscription',
  
    // Gifts & Donations
    'Amazon for Birthday Gifts',
    'Red Cross for Charitable Donations',
  
    // Miscellaneous
    'FedEx Shipping',
    'OfficeMax Office Supplies',
  
    // Business Expenses (if applicable)
    'Facebook Marketing and Advertising',
    'Staples for Office Supplies',
    'Utilities',
    'Furniture & Decor',
    'Car Payment',
    'Auto Insurance',
    'Fuel',
    'Public Transportation',
    'Ride-Sharing',
    'Vehicle Maintenance',
    'Parking Fees',
    'Registration and License',
    'Groceries',
    'Dining Out',
    'Fast Food',
    'Coffee Shops',
    'Alcohol/Bars',
    'Electricity',
    'Water',
    'Gas',
    'Trash',
    'Internet',
    'Cable',
    'Phone Bill',
    'Health Insurance',
    'Dental Insurance',
    'Life Insurance',
    'Disability Insurance',
    'Long-term Care Insurance',
    'Gym Membership',
    'Sports Leagues',
    'Fitness Equipment',
    'Medical Bills',
    'Prescription Medications',
    'Over-the-Counter Medicines',
    'Wellness Products',
    'Clothing',
    'Haircuts & Personal Grooming',
    'Laundry/Dry Cleaning',
    'Babysitting/Childcare',
    'Pet Care',
    'Veterinary Bills',
    'Credit Card Payments',
    'Student Loan Payments',
    'Personal Loan Payments',
    'Debt Consolidation',
    'Emergency Fund',
    'Retirement Fund',
    'College Savings',
    'Investment Portfolio',
    'Movies/Theater',
    'Concerts',
    'Books & Magazines',
    'Games',
    'Streaming Services',
    'Hobbies',
    'Airfare',
    'Hotels',
    'Vacation Packages',
    'Rental Cars',
    'Travel Insurance',
    'Tuition',
    'Textbooks',
    'School Supplies',
    'Online Courses',
    'Workshops',
    'Software Subscriptions',
    'Magazines/Newspapers',
    'Club Memberships',
    'Professional Organizations',
    'Birthday Gifts',
    'Wedding Gifts',
    'Charitable Donations',
    'Religious Donations',
    'Political Donations',
    'Bank Fees',
    'Postage/Shipping',
    'Office Supplies',
    'Legal Fees',
    'Taxes',
    'Holiday Gifts',
    'Party Supplies',
    'Decorations',
    'Office Rent',
    'Equipment Purchase',
    'Marketing and Advertising',
    'Business Travel',
    'Client Entertainment'
  ];

  const onTextChange = (e) => {
    const userInput = e.target.value;
    setText(userInput);
    
    // Filter our suggestions that don't contain the user's input
    let matches = [];
    if (userInput.length > 0) {
      matches = autoCompleteSuggestions.filter(suggestion => {
        const regex = new RegExp(`^${userInput}`, "gi");
        return suggestion.match(regex);
      });
    }
    setSuggestions(matches);
    setShowSuggestions(true);
  };

  const onSuggestionClick = (suggestion) => {
    setText(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <>
      <h3>Add new transaction</h3>
      <form onSubmit={onSubmit}>
        {/* <div className="form-control">
          <label htmlFor="text">Text</label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text..." />
        </div> */}
        <div className="form-control">
          <label htmlFor="text">Text</label>
          <input type="text" value={text} onChange={onTextChange} placeholder="Enter text..." />
          {showSuggestions && text && (
            <ul className="suggestions-list">
              {suggestions.map(suggestion => (
                <li key={suggestion} onClick={() => onSuggestionClick(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="form-control">
          <label htmlFor="amount">
            Amount <br />
            (negative - expense, positive - income)
          </label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount..." />
        </div>
        <div className="form-control">
          <label htmlFor="date">Date<br /></label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="date-input" />
        </div>
        <div className="form-control">
          <label htmlFor="category">Category<br /></label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="" disabled>Select category</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="form-control">
          <label htmlFor="newCategory">New Category <br /></label>
          <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Add new category" />
          <button type="button" onClick={addNewCategory}>Add Category</button>
        </div>
        {/* <button className="btn" disabled={!text.trim() || !amount || !date.trim() || !category.trim()}>Add transaction</button> */}
        <button
          className={`btn ${isButtonClicked ? 'btn-clicked' : ''}`}
          disabled={!text.trim() || !amount}
        >
          {isButtonClicked ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
      <div className="form-control">
        <label htmlFor="file">Receipt</label>
        <input type="file" onChange={handleFileChange} disabled={isLoading} />
        <button onClick={handleConvert} disabled={isLoading || !selectedFile}>
          {isLoading ? 'Converting...' : 'Click to automatically extract text and amount from receipt and fill in in the above boxes'}
        </button>
      </div>
    </>
  )
}
