import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Payment from './pages/Payment';
import './App.css';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/payment" element={<Payment />} />
        {/* Add more routes here as needed */}
        {/* <Route path="/" element={<Home />} /> */}
      </Routes>
    </Router>
  );
}

export default App;