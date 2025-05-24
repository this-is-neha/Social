

import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../common/header";
import Footer from "../common/footer";
const baseUrl= import.meta.env.VITE_API_BASE_URL
const Profile = () => {
  const { id } = useParams();
  const [loggedIn, setLoggedIn] = useState<any>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const getLoggedInUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.log("No token found in localStorage");
          return;
        }

        const response = await axios.get(`${baseUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLoggedIn(response.data.result);
      } catch (exception) {
        console.log("Error loading logged-in user:", exception);
      }
    };

    getLoggedInUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoggedIn({ ...loggedIn, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      console.log("Uploaded file:", file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", loggedIn.name);
      data.append("email", loggedIn.email);

      if (selectedFile) {
        data.append("image", selectedFile);
      }

      const response = await axios.put(
        `${baseUrl}/auth/update/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response from server:", response.data);
      setLoggedIn(response.data.result);
      setSelectedFile(null);
    } catch (exception) {
      console.log("Error updating user:", exception);
    }
  };

  return (
    <>
      <Header />
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center">
        <div className="w-[500px] bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-semibold text-center mb-6">Edit Profile</h1>
          <form
            className="space-y-4"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <input
              type="text"
              name="name"
              value={loggedIn.name || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded text-lg"
              placeholder="Name"
              required
            />
            <input
              type="email"
              name="email"
              value={loggedIn.email || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded text-lg"
              placeholder="Email"
              required
            />

            <div>
              <label className="block text-lg mb-1">Current Image</label>
              {loggedIn.image && typeof loggedIn.image === "string" && (
                <img
                  src={`${baseUrl}/uploads/${loggedIn.image}`}
                  alt="Profile"
                  className="w-32 h-32 object-cover mb-2 rounded border"
                />
              )}

              <label className="block text-lg mt-4 mb-1">Change Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded text-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              UPDATE
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
