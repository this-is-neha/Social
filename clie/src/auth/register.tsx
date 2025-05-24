import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const baseUrl= import.meta.env.VITE_API_BASE_URL
const Register = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    image: null as File | null,
    password: '',
    confirmPassword: '',
  });
const navigate= useNavigate()
  const handleChange = (e:any) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlefileChange = (e:any) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setUser({ ...user, image: file }); 
      console.log("Uploaded filessss:", file);
    }
  }
 
  const handleSubmit = async (e: any) => {
  e.preventDefault();

  if (user.password !== user.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("password", user.password);
    if (user.image) {
      formData.append("image", user.image);
    }

    const response = await axios.post(`${baseUrl}/auth/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Registration successful:", response.data);
    navigate("/activate");
  } catch (error: any) {
    console.error("Registration error:", error.response?.data || error.message);
    alert("Registration failed");
  }
};

  return (
 
     <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center">
      <div className="w-[500px] bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-center mb-6">Create Account</h1>
        <form className="space-y-4" onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded text-lg"
            placeholder="Name"
            required
          />
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded text-lg"
            placeholder="Email"
            required
          />
          
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded text-lg"
            placeholder="Password"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            value={user.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded text-lg"
            placeholder="Confirm Password"
            required
          />
          <input
            type="file"
            name="image"
            onChange={handlefileChange}
            className="w-full p-2 border border-gray-300 rounded text-lg"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
