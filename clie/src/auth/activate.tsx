

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const baseUrl= import.meta.env.VITE_API_BASE_URL
const Activate = () => {
  const [token, setToken] = useState({
    activationToken: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setToken({ ...token, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${baseUrl}/auth/activate/${token.activationToken}`
      );
      console.log("Response is ", response);
      navigate("/login");
    } catch (error) {
      alert("Activation failed. Please check the token.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Activate Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="activationToken"
            value={token.activationToken}
            onChange={handleChange}
            placeholder="Enter activation token"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Activate
          </button>
        </form>
      </div>
    </div>
  );
};

export default Activate;
