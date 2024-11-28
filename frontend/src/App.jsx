import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Home';
import SignUpPage from './components/SignUpPage'
import SignInPage from './components/SignInPage';  
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
export const App = () => {
 return (
   <Router>
     <Routes>
       <Route path="/" element={<HomePage />} />
       <Route path="/signup" element={<SignUpPage />} />
       <Route path="/signin" element={<SignInPage />} />
       <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/tasklist" element={<TaskList />} />
     </Routes>
   </Router>
 );
};
export default App;