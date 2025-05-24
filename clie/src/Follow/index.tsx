

import { useContext, useEffect, useState } from "react";
import Header from "../common/header";
import Footer from "../common/footer";
import axios from "axios";
import { UserContext } from "../constext/following.context";
import { FollowerContext } from "../constext/followers.context";
import { motion, AnimatePresence } from "framer-motion";
const baseUrl= import.meta.env.VITE_API_BASE_URL
const Follow = () => {
  const { user } = useContext(UserContext);
  const { follower } = useContext(FollowerContext);

  const [allUsers, setAllUsers] = useState([]);
  const [loggedInId, setLoggedInId] = useState<string | null>(null);
  const [followingIds, setFollowingIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchLoggedInId = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const res = await axios.get(`${baseUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoggedInId(res.data.result._id);
      } catch (err) {
        console.error("Failed to fetch logged-in user ID", err);
      }
    };

    fetchLoggedInId();
  }, []);

  useEffect(() => {
    if (user?.result) {
      setFollowingIds(user.result.map((u: any) => u._id));
    }
  }, [user]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await axios.get(`${baseUrl}/auth/all`);
        setAllUsers(res.data.result);
      } catch (err) {
        console.error("Failed to fetch all users", err);
      }
    };

    fetchAllUsers();
  }, []);

  const handleToggleFollow = async (targetUserId: string) => {
    if (!loggedInId) return;
    try {
      const response = await axios.put(`${baseUrl}/auth/follow/${targetUserId}/${loggedInId}`);
      const res = await axios.get(`${baseUrl}/auth/following/${loggedInId}`);
      setFollowingIds(res.data.result.map((u: any) => u._id));
    } catch (err) {
      console.error("Error toggling follow", err);
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">People You May Know</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {allUsers.map((u: any) => (
              <motion.div
                key={u._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white shadow rounded-lg p-4 flex flex-col items-center text-center"
              >
                <img
                  src={u.image ? `${baseUrl}/uploads/${u.image}` : "/default-avatar.png"}
                  alt={u.name}
                  className="w-24 h-24 rounded-full object-cover mb-3"
                />
                <h3 className="text-lg font-medium">{u.name}</h3>
                <p className="text-sm text-gray-500">{u.email}</p>

                {u._id !== loggedInId && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleToggleFollow(u._id)}
                    className={`mt-2 px-4 py-1 rounded text-white ${
                      followingIds.includes(u._id)
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {followingIds.includes(u._id) ? "Unfollow" : "Follow"}
                  </motion.button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Follow;
