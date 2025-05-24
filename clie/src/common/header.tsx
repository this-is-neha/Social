import { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const [loggedIn, setLoggedIn] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const getLoggedInUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.log("No token found in localStorage");
          return;
        }

        const response = await axios.get('http://localhost:3002/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Logged-in user response:", response.data);
        setLoggedIn(response.data.result);
      } catch (exception) {
        console.log("Error loading logged-in user:", exception);
      }
    };

    getLoggedInUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setLoggedIn(null);
    window.location.href = "/login"; 
  };

  return (
    <header className="bg-gray-900 text-white py-4 shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
 
      <NavLink to="/" className="text-xl font-bold">
          SOCIAL
        </NavLink>
        <nav className="space-x-4">
          {!loggedIn ? (
            <>
              <a href="/register" className="hover:underline">Register</a>
              <a href="/login" className="hover:underline">Login</a>
            </>
          ) : (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              className="hover:underline text-red-400"
            >
              Logout
            </a>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
