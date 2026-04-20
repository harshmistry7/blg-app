import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, setLoggedIn } from "../utils/auth";

const API_BASE_URL =  "http://localhost:3000";

export default function Dashboard() {
    const [loggedIn, setLoggedInState] = useState(isLoggedIn());
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editPost, setEditPost] = useState(null);
    const [form, setForm] = useState({ title: "", content: "" });
    const [formError, setFormError] = useState("");
    const [pageError, setPageError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchPosts = async () => {
        setPageError("");
        try {
            const res = await fetch(`${API_BASE_URL}/api/posts`, {
                method: "GET",
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    setLoggedIn(false);
                    setLoggedInState(false);
                }
                throw new Error(data.message || "Failed to fetch posts");
            }

            setPosts(data.posts || []);
        } catch (error) {
            setPageError(error.message || "Failed to fetch posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleLogout = () => {
        fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: "POST",
            credentials: "include",
        }).finally(() => {
            setLoggedIn(false);
            setLoggedInState(false);
            navigate("/");
        });
    };


    const filtered = posts.filter((p) =>
        (p.author?.username || "").toLowerCase().includes(search.toLowerCase())
    );


    const openCreate = () => {
        setEditPost(null);
        setForm({ title: "", content: "" });
        setFormError("");
        setShowForm(true);
    };


    const openEdit = (post) => {
        setEditPost(post);
        setForm({ title: post.title, content: post.content });
        setFormError("");
        setShowForm(true);
    };


    const handleDelete = async (id) => {
        if (window.confirm("Delete this post?")) {
            try {
                const res = await fetch(`${API_BASE_URL}/api/posts/delete/${id}`, {
                    method: "DELETE",
                    credentials: "include",
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to delete post");
                }

                await fetchPosts();
            } catch (error) {
                setPageError(error.message || "Failed to delete post");
            }
        }
    };


    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.title || !form.content) {
            setFormError("Title and content are required.");
            return;
        }

        try {
            const endpoint = editPost
                ? `${API_BASE_URL}/api/posts/update/${editPost._id}`
                : `${API_BASE_URL}/api/posts/create`;

            const method = editPost ? "PUT" : "POST";

            const res = await fetch(endpoint, {
                method,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: form.title,
                    content: form.content,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to save post");
            }

            setShowForm(false);
            setEditPost(null);
            setForm({ title: "", content: "" });
            await fetchPosts();
        } catch (error) {
            setFormError(error.message || "Failed to save post");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">


            <nav className="bg-white border-b-4 border-gray-200 px-6 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="white">
                            <path d="M3 4h14v2H3V4zm0 4h10v2H3V8zm0 4h12v2H3v-2z" />
                        </svg>
                    </div>
                    <span className="font-bold text-gray-800 text-lg">Inkwell</span>
                </div>
                <button
                    onClick={loggedIn ? handleLogout : () => navigate("/login")}
                    className={`text-sm text-white rounded-lg px-4 py-2 ${
                        loggedIn ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {loggedIn ? "Logout" : "Login"}
                </button>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-8">

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800"> Blog Dashboard</h1>
                        <p className="text-sm text-gray-700 mt-2"> Total {posts.length} posts</p>
                    </div>
                    <button
                        onClick={loggedIn ? openCreate : () => navigate("/login")}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm
                       font-medium rounded-lg px-4 py-2 transition"
                    >
                        {loggedIn ? "New Post" : "Login to Post"}
                    </button>
                </div>

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by author"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full max-w-200 border border-gray-300 rounded-lg px-4 py-2
                       text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                {pageError && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {pageError}
                    </div>
                )}

                {loading ? (
                    <div className="text-center text-gray-400 py-5">Loading posts...</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center text-gray-400 py-5">No posts found.</div>
                ) : (
                    <div className="space-y-7">
                        {filtered.map((post) => (
                            <div key={post._id}
                                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition">
                                <div className="flex items-start justify-between gap-5">
                                    <div className="flex-1 min-w-0">
                                        <h2 className="font-semibold text-gray-800 text-base truncate">
                                            {post.title}
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                            {post.content}
                                        </p>
                                        <div className="flex items-center gap-3 mt-3">
                                            <span className="text-xs bg-blue-50 text-blue-700 font-semibold
                                       border border-blue-100 rounded-md p-2.5">
                                                {post.author?.username || "Unknown"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {loggedIn ? (
                                            <>
                                                <button
                                                    onClick={() => openEdit(post)}
                                                    className="text-[13px] bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post._id)}
                                                    className="text-[13px] bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 transition"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => navigate("/login")}
                                                    className="text-[13px] bg-gray-700 hover:bg-gray-800 text-white rounded-lg px-4 py-2 transition"
                                                >
                                                    Login to Edit
                                                </button>
                                                <button
                                                    onClick={() => navigate("/login")}
                                                    className="text-[13px] bg-gray-700 hover:bg-gray-800 text-white rounded-lg px-4 py-2 transition"
                                                >
                                                    Login to Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showForm && loggedIn && (
                <div className="fixed inset-0 bg-black/40  backdrop-blur-sm flex items-center justify-center px-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-5">
                            {editPost ? "Edit Post" : "Create New Post"}
                        </h2>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
                                <input
                                    type="text"
                                    placeholder="Post title"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                             focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Content</label>
                                <textarea
                                    rows={4}
                                    placeholder="Write your post content..."
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                             focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                />
                            </div>

                            {formError && (
                                <p className="text-sm text-red-500">{formError}</p>
                            )}

                            <div className="flex gap-3 pt-1">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white
                             font-medium text-sm rounded-lg py-2.5 transition"
                                >
                                    {editPost ? "Update Post" : "Create Post"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 border border-gray-300 hover:bg-gray-50
                             text-gray-600 text-sm rounded-lg py-2.5 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}