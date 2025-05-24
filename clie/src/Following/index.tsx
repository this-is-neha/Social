import { useContext, useEffect, useState } from "react";
import { UserContext } from "../constext/following.context";
import { FollowerContext } from "../constext/followers.context"
import Header from "../common/header";
import Footer from "../common/footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Following = () => {
const baseUrl= import.meta.env.VITE_API_BASE_URL
    const { follower, loadings } = useContext(FollowerContext)
const navigate = useNavigate();
    const { user, loading } = useContext(UserContext);

    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([])
    const [loggedIn, setLoggedIn] = useState<string | null>(null);
    useEffect(() => {
        if (follower) {
            console.log("Follower", follower)
            console.log("Followed data", follower.result)
            setFollowers(follower.result || []);
        }
    })
    useEffect(() => {
        if (user) {
            console.log("Following:", user);
            console.log("following  data", user.result)
            setFollowing(user.result || []);

        }
    }, [user]);
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

                const idd = response.data.result._id;
                setLoggedIn(idd);


                

            } catch (exception) {
                console.log("Error loading logged-in user or following list:", exception);
            }
        };

        getLoggedInUser();
    }, []);
    const handleToggleFollow = async (followuserId: string) => {
        try {
            const response = await axios.put(`${baseUrl}/auth/follow/${followuserId}/${loggedIn}`);
            console.log("Follow response:", response.data);

        } catch (error) {
            console.error("Error toggling follow:", error);
        }
    };
    if (loading) return <p>Loading...</p>;
const handlechat = async (followuserId: string) => {
    try { 
        navigate(`/chat/${followuserId}`);
      }
        catch(exception) {
            console.log("Error loading logged-in user or following list:", exception);
        }}
    return (
        <>
            <Header />
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
               
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Following</h2>
                    {following.length > 0 ? (
                        <div className="grid gap-4">
                            {following.map((f: any) => (
                                <div
                                    key={f._id}
                                    className="flex items-center justify-between p-4 bg-white rounded shadow"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={
                                                f.image
                                                    ? `${baseUrl}/uploads/${f.image}`
                                                    : "/default-avatar.png"
                                            }
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
                                    <button
                    onClick={() => handlechat(f._id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                   Message
                  </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No users followed yet.</p>
                    )}
                </div>

                {/* Followers Column */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Followers</h2>
                    {followers.length > 0 ? (
                        <div className="grid gap-4">
                            {followers.map((f: any) => (
                                <div
                                    key={f._id}
                                    className="flex items-center justify-between p-4 bg-white rounded shadow"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={
                                                f.image
                                                    ? `${baseUrl}/uploads/${f.image}`
                                                    : "/default-avatar.png"
                                            }
                                            alt={f.name}
                                            className="w-32 h-32 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-medium">{f.name}</p>
                                            <p className="text-sm text-gray-500">{f.email}</p>
                                        </div>
                                    </div>
                                    <button
                    onClick={() => handlechat(f._id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                   Message
                  </button>
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

export default Following;
