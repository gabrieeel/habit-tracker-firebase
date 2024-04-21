import React, { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Home from './Home';
import SignIn from './SignIn';
import UserProfile from './UserProfile';

import Calendar from 'react-calendar';

import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import UserHabits from './UserHabits';
import HabitDetails from './HabitDetails'; // Import the component for habit details

function App() {

  // useEffect(() => {
  //   listExistingUsers(admin);
  // }, []);


  // Define selected dates
  const [selectedDates, setSelectedDates] = useState([
    new Date(2024, 2, 5), // March 5, 2024
    new Date(2024, 2, 10), // March 10, 2024
    new Date(2024, 2, 14) // March 14, 2024
  ]);


  // // Function to check if a date should be marked
  // const tileContent = ({ date, view }) => {
  //   if (view === 'month') {
  //     // Check if the date is in the selectedDates array
  //     const isSelected = selectedDates.some(selectedDate =>
  //       date.getDate() === selectedDate.getDate() &&
  //       date.getMonth() === selectedDate.getMonth() &&
  //       date.getFullYear() === selectedDate.getFullYear()
  //     );

  //     // Return JSX to render the mark if the date is selected
  //     return isSelected ? <div className="selected-date-mark">a</div> : null;
  //   }
  // };

  // Function to check if a date should be marked
  const tileContent = ({ activeStartDate, date, view }) => view === 'month' && date.getDay() === 0 ? <p>It's Sunday!</p> : null;

  const tileClassName =
    ({ activeStartDate, date, view }) => view === 'month' && date.getDay() === 3 ? 'red-border' : null;

  const [value, setValue] = useState(new Date());

  function onChange(nextValue) {
    setValue(nextValue);
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/habits" element={<UserHabits />} />
        <Route path="/habits/:id" element={<HabitDetails />} />

      </Routes>

      {/* <p>hola</p>

      <SignIn />

      <Calendar
        onChange={onChange}
        value={value}
        tileClassName={tileClassName}
        tileContent={tileContent}
      /> */}
    </Router>
  );
}


export default App