

import { useEffect, useState } from "react";
import axios from "axios";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { motion } from "framer-motion";
import Header from "../common/header";
import Footer from "../common/footer";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const Posts = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${baseUrl}/post/all`);
                setPosts(response.data.result);
                const savedLikes = JSON.parse(localStorage.getItem("likedPosts") || "{}");

                const initialLikes: { [key: string]: boolean } = {};
                response.data.result.forEach((post: any) => {
                    initialLikes[post._id] = savedLikes[post._id] || false;
                });

                setLikedPosts(initialLikes);
            } catch (error) {
                console.error("Failed to fetch posts", error);
            }
        };

        fetchPosts();
    }, []);

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
            <motion.div
                className="max-w-7xl mx-auto py-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-3xl font-semibold mb-6">Recent Posts</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post._id}
                            className="bg-white p-4 rounded-lg shadow-lg"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                        >
                            <h3 className="text-xl font-bold">{post.title}</h3>

                            {post.location && (
                                <div className="mt-2 text-sm text-gray-500">{post.location}</div>
                            )}

                            {post.media?.length > 0 && (
                                <div className="mt-4">
                                    <img
                                        src={`${baseUrl}/uploads/${post.media[0]}`}
                                        alt={post.title}
                                        className="w-full h-200 object-cover rounded-lg"
                                    />
                                </div>
                            )}

                            <p className="text-gray-700 mt-2">{post.content}</p>

                            <div className="mt-2 text-sm text-gray-500">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </div>

                            <div className="mt-2 text-sm text-gray-500">
                                <span className="font-semibold">Tags:</span> {post.tags.join(", ")}
                            </div>

                            <div className="mt-2 text-sm text-gray-500">
                                <span className="font-semibold">Visibility:</span> {post.visibility}
                            </div>

                            <div className="mt-4">
                                <button onClick={() => toggleLike(post._id)} className="focus:outline-none">
                                    {likedPosts[post._id] ? (
                                        <AiFillHeart className="text-red-500 text-3xl" />
                                    ) : (
                                        <AiOutlineHeart className="text-gray-500 text-3xl hover:text-red-500 transition" />
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
            <Footer />
        </>
    );
};

export default Posts;
