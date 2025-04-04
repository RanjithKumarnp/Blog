import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

function DiaryApp() {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const adminCredentials = { username: "admin", password: "password" };

    // State for likes, comments, and liked post tracking
    const [likes, setLikes] = useState({});
    const [comments, setComments] = useState({});
    const [likedPosts, setLikedPosts] = useState([]); // Store liked post IDs

    // Load data from localStorage on app load
    useEffect(() => {
        const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        const storedLikes = JSON.parse(localStorage.getItem("likes")) || {};
        const storedComments = JSON.parse(localStorage.getItem("comments")) || {};
        const storedLikedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
        
        setPosts(storedPosts);
        setLikes(storedLikes);
        setComments(storedComments);
        setLikedPosts(storedLikedPosts);
    }, []);

    // Save data to localStorage
    useEffect(() => {
        localStorage.setItem("posts", JSON.stringify(posts));
        localStorage.setItem("likes", JSON.stringify(likes));
        localStorage.setItem("comments", JSON.stringify(comments));
        localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
    }, [posts, likes, comments, likedPosts]);

    // Login validation
    const handleLogin = () => {
        if (username === adminCredentials.username && password === adminCredentials.password) {
            setIsLoggedIn(true);
        } else {
            alert("Invalid credentials");
        }
    };

    // Logout
    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        setPassword('');
    };

    // Add new post
    const handleAddPost = () => {
        if (newPost.trim()) {
            const newEntry = { id: Date.now(), content: newPost };
            setPosts([...posts, newEntry]);
            setNewPost('');
        }
    };

    // Delete post
    const handleDeletePost = (id) => {
        setPosts(posts.filter(post => post.id !== id));
    };

    // Restrict liking to once per post
    const handleLike = (id) => {
        if (likedPosts.includes(id)) {
            alert("You have already liked this post!");
            return;
        }
        setLikes({ ...likes, [id]: (likes[id] || 0) + 1 });
        setLikedPosts([...likedPosts, id]); // Store post ID to prevent multiple likes
    };

    // Add comment
    const handleComment = (id, comment) => {
        if (comment.trim()) {
            const postComments = comments[id] || [];
            setComments({ ...comments, [id]: [...postComments, comment] });
        }
    };

    // Edit post
    const handleEditPost = (id) => {
        const postContent = prompt("Edit Post:", posts.find(post => post.id === id).content);
        if (postContent) {
            setPosts(posts.map(post => post.id === id ? { ...post, content: postContent } : post));
        }
    };

    // Generate Random Text Color
    const getRandomColor = () => {
        const colors = ["text-primary", "text-success", "text-danger", "text-warning", "text-info"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <div className="container diary-app">
            {/* Stylish Login Box */}
            {!isLoggedIn && (
                <div className="login-form-box position-fixed top-0 end-0 m-3 p-3 bg-light shadow rounded">
                    <h5 className="text-primary">Admin Login</h5>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-control mb-2"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control mb-2"
                    />
                    <button className="btn btn-primary w-100" onClick={handleLogin}>Login</button>
                </div>
            )}

            {/* Header */}
            <h1 className="title text-center mt-4 mb-4">N-Chat</h1>

            {/* Post Display */}
            <div className="post-list">
                {posts.length === 0 ? (
                    <p>No posts yet.</p>
                ) : (
                    posts.map((post) => (
                        <div key={post.id} className={`post border rounded p-3 mb-2 ${getRandomColor()}`}>
                            <p>{post.content}</p>
                            <button
                                className="btn btn-outline-primary me-2"
                                onClick={() => handleLike(post.id)}
                                disabled={likedPosts.includes(post.id)}
                            >
                                👍 {likes[post.id] || 0}
                            </button>
                            {isLoggedIn && (
                                <>
                                    <button className="btn btn-warning m-1" onClick={() => handleEditPost(post.id)}>Edit</button>
                                    <button className="btn btn-danger m-1" onClick={() => handleDeletePost(post.id)}>Delete</button>
                                </>
                            )}
                           {/* Comment Section */}
<div className="comment-section mt-2">
    {(comments[post.id] || []).map((comment, index) => (
        <p key={index} className="comment" style={{ fontSize: "12px", marginBottom: "5px" }}>{comment}</p>
    ))}
    <input
        type="text"
        placeholder="Write a comment..."
        onKeyDown={(e) => {
            if (e.key === "Enter") {
                handleComment(post.id, e.target.value);
                e.target.value = "";
            }
        }}
        className="form-control mt-2"
        style={{ fontSize: "12px", padding: "3px", height: "25px", width: "40%" }}
    />
</div>


                             
                        </div>
                    ))
                )}
            </div>

            {/* Admin Post Controls */}
            {isLoggedIn && (
                <div className="admin-controls mt-4">
                    <textarea
                        rows="3"
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="form-control mb-2"
                    />
                    <button className="btn btn-success m-2" onClick={handleAddPost}>Add Post</button>
                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
}

export default DiaryApp;