import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../common/header";
import Footer from "../common/footer";
const PostsCreate = () => {
    const [post, setPost] = useState({
        user: "",
        title: "",
        content: "",
        media: null as File | null,
        tags: "",
        visibility: "public",
        location: "",
    });

    const [loggedIn, setLoggedIn] = useState<{ name: string } | null>(null);

    useEffect(() => {
        const getLoggedInUser = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    console.log("No token found in localStorage");
                    return;
                }

                const response = await axios.get('http://localhost:3002/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Logged-in user responsvyhgvhge:", response.data);
                setLoggedIn(response.data.result);
                const id = response.data.result._id
                console.log("Logged-in user ID:", id);
                setPost({ ...post, user: id });
            } catch (exception) {
                console.log("Error loading logged-in user:", exception);
            }
        };

        getLoggedInUser();
    }, []);

    const navigate = useNavigate();

    const handleChange = (e:any) => {
  
        setPost({ ...post, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setPost({ ...post, media: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("user", post.user );
        formData.append("title", post.title);
        formData.append("content", post.content);
        formData.append("visibility", post.visibility);
        formData.append("location", post.location);
        formData.append("tags", post.tags);
        if (post.media) {
            formData.append("media", post.media);
        }

        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.post("http://localhost:3002/post/create", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Post created:", response.data);
            navigate("/posts");
        } catch (err) {
            console.error("Error creating post:", err);
            alert("Failed to create post.");
        }
    };

    return (
     
<>
<Header/>
        <div className="max-w-xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Create a Post</h2>
            <form onSubmit={handleSubmit} className="space-y-12">
                <input type="hidden" name="user" value={post.user} />

                <input
                    type="text"
                    name="title"
                    placeholder="Post Title"
                    value={post.title}
                    onChange={handleChange}
                    required
                    className="w-full h-[50px] border px-5 py-2 rounded"
                />

                <textarea
                    name="content"
                    placeholder="Write your post..."
                    value={post.content}
                    onChange={handleChange}
                    className="w-full h-[100px] border px-4 py-2 rounded"
                ></textarea>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full"
                />

                <input
                    type="text"
                    name="tags"
                    placeholder="Tags (comma separated)"
                    value={post.tags}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                />

                <select
                    name="visibility"
                    value={post.visibility}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="friends">Friends</option>
                </select>

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={post.location}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                />

                <button
                    type="submit"
                    className="w-full h-[50px] bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Submit Post
                </button>
            </form>
        </div>
        <Footer />
        </>
    );
};

export default PostsCreate;
