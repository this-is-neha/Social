
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../common/header";
import Footer from "../common/footer";
import { AiFillHeart } from "react-icons/ai";

const User = () => {
  const [loggedIn, setLoggedIn] = useState<{
    name?: string;
    email?: string;
    image?: string;
    status?: string;
    _id?: string;
  } | null>(null);
  const [posts, setPost] = useState<any[]>([]);

  const navigate = useNavigate();
  useEffect(() => {
    const getLoggedInUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.log("No token found in localStorage");
          return;
        }

        const response = await axios.get("http://localhost:3002/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Logged-in user response:", response.data);
        setLoggedIn(response.data.result);
        const id = response.data.result._id;
        console.log("Logged-in user ID:", id);
      } catch (exception) {
        console.log("Error loading logged-in user:", exception);
      }
    };

    getLoggedInUser();
  }, []);
  useEffect(() => {
    const getPost = async () => {
      try {
        if (!loggedIn?._id) {
          console.log("User ID not found");
          return;
        }
        const response = await axios.get(`http://localhost:3002/post/user/${loggedIn._id}`);
        console.log("Post response:", response.data);
        setPost(response.data.result);
      } catch (exception) {
        console.log("Error loading posts:", exception);
      }
    };
    getPost();
  }, [loggedIn]);

  const handleFollowers = async (id: any) => {
    console.log("My Id ", id);
    try {
      const response = await axios.get(`http://localhost:3002/auth/followers/${id}`);
      console.log("Followers response:", response);
      navigate(`/followers/${id}`);
    } catch (exception) {
      console.log("Error loading followers:", exception);
    }
  }
  const handleFollowing = async (id: any) => {
    console.log("My Id ", id);
    try {
      const response = await axios.get(`http://localhost:3002/auth/following/${id}`);
      console.log("Following response:", response);
      navigate(`/following/${id}`);

    }
    catch (exception) {
      console.log("Error loading following:", exception);
    }
  }
  return (
    <>
      <Header />


      <div className="w-full max-w-7xl bg-white shadow-xl rounded-xl p-10 flex flex-col md:flex-row gap-10">

        {loggedIn?.image && (
          <div className="flex-shrink-0 flex justify-center md:justify-start">
            <div className="w-full h-full border-4 border-blue-500 rounded-lg overflow-hidden">
              <img
                src={`http://localhost:3002/uploads/${loggedIn.image}`}
                alt="Profile"
                className="w-[1200px] h-full object-cover"
              />
            </div>
          </div>
        )}


        <div className="flex-1 mx-5 md:mx-20">
          <h1 className="text-4xl font-bold mb-6 text-center md:text-left text-blue-700">Your Profile</h1>
          {loggedIn ? (
            <div className="bg-gray-50 rounded-xl shadow-lg p-6 space-y-8">
              <div className="space-y-2">
                <p className="text-3xl font-semibold text-gray-800">{loggedIn.name}</p>
                <p className="text-gray-600 text-lg">{loggedIn.email}</p>
                <p className="text-green-600 font-medium capitalize">{loggedIn.status}</p>
                <p className="text-sm text-gray-400">ID: {loggedIn._id}</p>
              </div>

              <div className="flex flex-col gap-4 text-sm font-medium text-gray-700 w-full max-w-xs">
                <button
                  onClick={() => navigate(`/user/${loggedIn._id}/edit`)}
                  className="flex items-center gap-2 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition"
                >
                  🛠️ Edit Profile
                </button>

                <button
                  onClick={() => navigate("/posts/create")}
                  className="flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                  ✏️ Create Post
                </button>

                <button
                  onClick={() => handleFollowers(loggedIn._id)}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg transition">
                  👥 Followers/Following
                </button>

          
              </div>

            </div>
          ) : (
            <p className="text-gray-600">Loading user information...</p>
          )}
        </div>

      </div>
      {posts.length > 0 ? (
        <div className="mt-10 w-full max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-blue-700 mb-4">Your Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <div key={post._id} className="border rounded-xl shadow-md p-5 bg-white">
                <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
                <h3 className="text-s  text-gray-800">{post.location}</h3>
                {post.media && post.media.length > 0 && (
                  <div className="mt-4">
                    {post.media.map((file: string, idx: number) => (
                      <img
                        key={idx}
                        src={`http://localhost:3002/uploads/${file}`}
                        alt={`Post media ${idx + 1}`}
                        className="w-[200px] h-[240px] object-cover rounded-lg shadow"
                      />
                    ))}
                  </div>
                )}

                <p className="text-gray-700 mt-2">{post.content}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <AiFillHeart className="text-red-500 text-xl mr-1" />
                  {post.likes.length}
                </div>

              </div>
            ))}

          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">You have not posted anything yet.</p>
      )}




      <Footer />
    </>
  );
};

export default User;
