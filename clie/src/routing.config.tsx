import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Landing from "../src/landing";
import Register from "../src/auth/register";
import Activate from './auth/activate';
import Login from './auth/login';
import PostsCreate from './Posts/posts.create';
import Posts from './Posts/postlist';
import User from '../src/auth/userPage';
import Editing from './auth/editprofile';
import Follow from './Follow';
import People from '../src/Following';
import Followings from './Predux';
import Chat from './chat';
import axios from 'axios';
import ChatWrapper from './chatWrapper';

const Routing = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://localhost:3002/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userId = response.data.result._id;
        setUserId(userId);
      } catch (error) {
        console.log("Error loading logged-in user:", error);
      }
    };

    fetchUserId();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/activate" element={<Activate />} />
      <Route path="/login" element={<Login />} />
      <Route path="/posts/create" element={<PostsCreate />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/profile" element={<User />} />
      <Route path="/user/:id/edit" element={<Editing />} />
      <Route path="/people" element={<Follow />} />
      <Route path="/followers/:id" element={<People />} />
      <Route path="/following" element={<Followings />} />
    <Route path="/chat/:userId" element={<ChatWrapper />} />

    </Routes>
  );
};

export default Routing;
