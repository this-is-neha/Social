import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFollowers } from "../redux/followers.slice";
import { fetchUserFollowing } from "../redux/followingslice";
import { RootState, AppDispatch } from "../redux/store";
import Header from "../common/header";
import Footer from "../common/footer";
import axios from "axios";

const Followings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { followers } = useSelector((state: RootState) => state.follower);
  const { following, loading } = useSelector((state: RootState) => state.user);
  const [loggedIn, setLoggedIn] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchFollowers());
    dispatch(fetchUserFollowing());
  }, [dispatch]);

  useEffect(() => {
    const getLoggedInUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const response = await axios.get("http://localhost:3002/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLoggedIn(response.data.result._id);
      } catch (error) {
        console.log("Error getting logged-in user:", error);
      }
    };

    getLoggedInUser();
  }, []);

  const handleToggleFollow = async (followuserId: string) => {
    try {
      const response = await axios.put(
        `http://localhost:3002/auth/follow/${followuserId}/${loggedIn}`
      );
      console.log("Follow response:", response.data);
      dispatch(fetchFollowers());
      dispatch(fetchUserFollowing());
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Following</h2>
          {following.length > 0 ? (
            <div className="grid gap-4">
              {following.map((f: any) => (
                <div key={f._id} className="flex items-center justify-between p-4 bg-white rounded shadow">
                  <div className="flex items-center gap-4">
                    <img
                      src={f.image ? `http://localhost:3002/uploads/${f.image}` : "/default-avatar.png"}
                      alt={f.name}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{f.name}</p>
                      <p className="text-sm text-gray-500">{f.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleFollow(f._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Unfollow
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No users followed yet.</p>
          )}
        </div>

        {/* Followers List */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Followers</h2>
          {followers.length > 0 ? (
            <div className="grid gap-4">
              {followers.map((f: any) => (
                <div key={f._id} className="flex items-center justify-between p-4 bg-white rounded shadow">
                  <div className="flex items-center gap-4">
                    <img
                      src={f.image ? `http://localhost:3002/uploads/${f.image}` : "/default-avatar.png"}
                      alt={f.name}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{f.name}</p>
                      <p className="text-sm text-gray-500">{f.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No followers yet.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Followings;
