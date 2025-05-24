import Header from "../common/header";
import Footer from "../common/footer";
import { useEffect, useContext, useState, use } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { FaComments } from "react-icons/fa";
import { UserContext } from "../constext/following.context";
import { FollowerContext } from "../constext/followers.context"
import { FaUserCircle, FaCompass, FaPenFancy } from "react-icons/fa";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
const baseUrl = import.meta.env.VITE_API_BASE_URL;
import { motion } from "framer-motion";  
import { base } from "../../../server/src/modules/auth/auth.model";
const Landing = () => {
  const [loggedIn, setLoggedIn] = useState<{ name: string } | null>(null);
  const [idd, setId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const { user } = useContext(UserContext);
  const { follower } = useContext(FollowerContext);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([])
  const [iddd, setIdd] = useState<string | null>(null);
  const [chat, setChat] = useState<any[]>([])
  const [chatttt, setChatttt] = useState<any[]>([])
  const [userPosts, setUserPosts] = useState<
    {
      image: any; userId: string; name: string; posts: any[]
    }[]
  >([]);

  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});

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
        setIdd(response.data.result._id);
      } catch (exception) {
        console.log("Error loading logged-in user:", exception);
      }
    };

    getLoggedInUser();
  }, []);
  useEffect(() => {
    if (follower) {
      console.log("Follower", follower)
      console.log("Followed data", follower.result)
      const allIds = (follower.result || []).map((item: any) => item._id);
      console.log("All follower IDs:", allIds)
      setFollowers(follower.result || []);
    }
  })
  useEffect(() => {
    if (user) {
      console.log("Following:", user);
      console.log("All following  data", user.result)
      const allIds = (user.result || []).map((item: any) => item._id);
      console.log("All following IDs:", allIds)
      setFollowing(user.result || []);

    }
  }, [user]);


  useEffect(() => {
    const handleChatUsers = async (iddd: string[]) => {
      try {

        const response = await axios.get(`${baseUrl}/auth/chat/${iddd}`);
        console.log("Chat users response:", response);
        console.log("Chat users:", response.data.result);
        setChat(response.data.result || []);
        const chatUsers = response.data.result || [];
        const userDetails = await Promise.all(
          chatUsers.map((userId: string) =>
            axios.get(`${baseUrl}/auth/single/${userId}`)
          )
        );
        console.log("User details:", userDetails);
        const extractedDetails = userDetails.map(res => res.data.result);
        console.log("Chat users details:", extractedDetails);

        setChatttt(extractedDetails);

      }
      catch (exception) {
        console.log("Error loading chat users:", exception);
      }
    };
    if (typeof iddd === "string") {
      handleChatUsers([iddd]);
    }
  }, [iddd])



  const handlePosts = async (userIds: string[]) => {
    try {
      const allUserPosts: { userId: string; name: string; image: File; posts: any[] }[] = [];
      console.log("All user posts", allUserPosts)
      for (const userId of userIds) {
        const [userRes, postsRes] = await Promise.all([
          axios.get(`${baseUrl}/auth/single/${userId}`),
          axios.get(`${baseUrl}/post/user/${userId}`),
        ]);

        const name = userRes.data.result.name;
        const image = userRes.data.result.image;
        const posts = postsRes.data.result || [];

        if (posts.length > 0) {

          const savedLikes = JSON.parse(localStorage.getItem("likedPosts") || "{}");
          const initialLikes: { [key: string]: boolean } = {};
          posts.forEach((post: any) => {
            initialLikes[post._id] = savedLikes[post._id] || false;
          });
          setLikedPosts((prev) => ({ ...prev, ...initialLikes }));

          allUserPosts.push({ userId, name, image, posts });
        }
      }

      setUserPosts(allUserPosts);
    } catch (error) {
      console.log("Error fetching posts and user info:", error);
    }
  };



  useEffect(() => {
    const Fetch = async () => {
      try {
        console.log("User IDs:", idd);
        const response = await axios.get(`${baseUrl}auth/single/${idd}`);
        console.log("User resposne:", response);
        setName(response.data.result.name);
        console.log("User name:", response.data.result.name);
      }
      catch (exception) {
        console.log("Error loading posts:", exception);
      }
    };
    Fetch();
  }, [idd]);



  useEffect(() => {
    const followerIds = (follower?.result || []).map((item: any) => item._id);
    const followingIds = (user?.result || []).map((item: any) => item._id);
    const allUserIds = [...new Set([...followerIds, ...followingIds])];

    console.log("All User IDs:", allUserIds);
    if (allUserIds.length > 0) {
      handlePosts(allUserIds);
    }
  }, [follower, user]);


  const toggleLike = async (postId: string) => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.post(
        `${baseUrl}/post/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedLikedPosts = {
        ...likedPosts,
        [postId]: !likedPosts[postId],
      };

      setLikedPosts(updatedLikedPosts);
      localStorage.setItem("likedPosts", JSON.stringify(updatedLikedPosts));
    } catch (error) {
      console.error("Failed to toggle like", error);
    }
  };


  return (
    <>
      <Header />



      <div className="flex flex-col md:flex-row gap-8 bg-blue-50 p-6">
        <motion.div
          className="flex-1 max-w-full"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Community Posts</h2>


          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <NavLink
              to="/people"
              className="flex items-center justify-center w-12 h-12 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition"
              title="Explore People"
            >
              <FaCompass size={20} />
            </NavLink>

            <NavLink
              to="/posts"
              className="flex items-center justify-center w-12 h-12 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition"
              title="Explore Posts"
            >
              <FaCompass size={20} />
            </NavLink>

            {loggedIn ? (
              <>
                <NavLink
                  to="/posts/create"
                  className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
                  title="Create a Post"
                >
                  <FaPenFancy size={20} />
                </NavLink>
               

                <NavLink
                  to="/profile"
                  className="flex items-center justify-center w-12 h-12 bg-gray-700 text-white rounded-full shadow hover:bg-gray-800 transition"
                  title="My Profile"
                >
                  <FaUserCircle size={20} />
                </NavLink>
              </>
            ) : (
              <p className="text-gray-600 text-base">
                Please login to create a post or view your profile.
              </p>
            )}
          </div>


          {userPosts.length === 0 ? (
            <p className="text-gray-500">No posts available yet.</p>
          ) : (
            <div className="space-y-10 max-w-[1200px] ">
              {userPosts.map((user, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="flex items-center space-x-4">
                    {user.image && (
                      <img
                        src={`${baseUrl}/uploads/${user.image}`}
                        alt={`${user.name}'s profile`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <h3 className="text-xl font-semibold text-gray-700">{user.name}</h3>
                  </div>

                  {user.posts.map((post, i) => (
                    <div
                      key={i}
                      className="p-10 mx-0 md:mx-10 max-w-full md:max-w-[800px] border rounded-lg shadow bg-white space-y-4"
                    >
                      <h4 className="font-bold text-lg text-gray-800">{post.title}</h4>

                      {post.media?.length > 0 && (
                        <div className="mt-4 space-y-4">
                          {post.media.map((file, mIdx) => (
                            <img
                              key={mIdx}
                              src={`${baseUrl}/uploads/${file}`}
                              alt={`Post media ${mIdx + 1}`}
                              className="w-full max-w-[800px] h-auto object-cover rounded-lg shadow"
                            />
                          ))}
                        </div>
                      )}

                      <p className="text-gray-600 font-semibold mt-4">
                        {post.content || post.summary}
                      </p>

                      <div className="mt-4">
                        <button onClick={() => toggleLike(post._id)} className="focus:outline-none">
                          {likedPosts[post._id] ? (
                            <AiFillHeart size={24} className="text-red-500" />
                          ) : (
                            <AiOutlineHeart
                              size={24}
                              className="text-gray-400 hover:text-red-400 transition"
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </motion.div>


        <motion.div
          className="flex-[1.8]  md:max-w-[600px] bg-gray-100 rounded-lg p-6 shadow overflow-y-auto"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ maxHeight: "80vh" }}
        >
          <h3 className="text-xl font-bold mb-4 text-gray-800">Chat</h3>
          {chatttt?.length === 0 ? (
            <p className="text-gray-500">No chat users found.</p>
          ) : (
            <ul className="space-y-4">
              {chatttt.map((user) => (
                <li key={user._id}>
                  <NavLink
                    to={`/chat/${user._id}`}
                    className="flex items-center space-x-3 hover:bg-gray-200 p-2 rounded-lg transition"
                  >
                    <img
                      src={`${baseUrl}/uploads/${user.image}`}
                      alt={user.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-gray-800 text-xl font-semibold">{user.name}</p>
                      <p className="text-gray-500 text-sm">{user._id}</p>
                    </div>
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

      </div>

      <Footer />
    </>
  );
};

export default Landing;



