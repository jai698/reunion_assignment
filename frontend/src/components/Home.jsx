import React from 'react';
import { Link } from 'react-router-dom';
const HomePage = () => {
 return (
   <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
     <h1 className="text-5xl font-extrabold mb-12">Welcome to Task Manager</h1>
     <div className="flex space-x-6">
       <Link to="/signin">
         <button className="px-6 py-3 border-2 border-white text-white bg-transparent hover:bg-white hover:text-black transition duration-300 ease-in-out">
           Sign In
         </button>
       </Link>
       <Link to="/signup">
         <button className="px-6 py-3 border-2 border-white text-white bg-transparent hover:bg-white hover:text-black transition duration-300 ease-in-out">
           Sign Up
         </button>
       </Link>
     </div>
   </div>
 );
};
export default HomePage;