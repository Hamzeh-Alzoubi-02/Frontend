// src/components/ViewPosts.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
  // التنسيقات

export default function ViewPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // حقول إدخال التعليق والرد
  const [commentText, setCommentText] = useState({});
  const [replyText, setReplyText] = useState({});

  // حركة نبض لزر الإعجاب
  const [animateLike, setAnimateLike] = useState({});

  // حالات النافذة المنبثقة
  // تخزن الـ postId الذي نريد عرض تعليقات منشوره
  const [activeCommentsPost, setActiveCommentsPost] = useState(null);
  // تخزن الـ postId الذي نريد عرض قائمة الإعجابات الخاصة به
  const [activeLikesPost, setActiveLikesPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");

        // التحقق من وجود التوكن
        if (!token) {
          setError("No authentication token found");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/get-posts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📌 Fetched Posts:", res.data);

        // التحقق من وجود الحقل "post" في البيانات المستلمة
        if (Array.isArray(res.data.post)) {
          // تصفية المنشورات بحيث تظهر فقط المنشورات المقبولة أو التي تم الموافقة عليها
          const approvedPosts = res.data.post.filter(post => post.status === 'approved');
          setPosts(approvedPosts);  // تعيين البيانات إلى الحالة
        } else {
          setError("Posts data is not in the expected format");
        }
      } catch (err) {
        setError(`Failed to fetch post details: ${err.message}`);
      } finally {
        setLoading(false);  // إيقاف حالة التحميل
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/like/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("📌 Liked Post:", res.data);

      // تحديث حالة الإعجابات في الواجهة
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: res.data.likes } : post
        )
      );

      // تشغيل تأثير النبض على زر الإعجاب
      setAnimateLike({ ...animateLike, [postId]: true });
      setTimeout(() => {
        setAnimateLike((prev) => ({ ...prev, [postId]: false }));
      }, 700);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleComment = async (postId) => {
    if (!commentText[postId]?.trim()) {
      return alert("❌ لا يمكن إضافة تعليق فارغ!");
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/comment/${postId}`,
        { comment: commentText[postId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // مسح الحقل بعد الإرسال
      setCommentText({ ...commentText, [postId]: "" });
    } catch (err) {
      console.error("Error commenting on post:", err.response?.data || err);
    }
  };

  const handleReply = async (postId, commentId) => {
    if (!replyText[commentId]?.trim()) {
      return alert("❌ لا يمكن إرسال رد فارغ!");
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/reply/${postId}/${commentId}`,
        { reply: replyText[commentId].trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // مسح حقل الرد
      setReplyText({ ...replyText, [commentId]: "" });
    } catch (err) {
      console.error("❌ خطأ أثناء إرسال الرد:", err.response?.data || err);
    }
  };

  // فتح/إغلاق نافذة التعليقات
  const handleShowComments = (postId) => {
    setActiveCommentsPost(postId);
  };
  const handleCloseComments = () => {
    setActiveCommentsPost(null);
  };

  // فتح/إغلاق نافذة الإعجابات
  const handleShowLikes = (postId) => {
    setActiveLikesPost(postId);
  };
  const handleCloseLikes = () => {
    setActiveLikesPost(null);
  };

  if (loading) return <div style={{ textAlign: "center" }}>Loading...</div>;
  if (error) return <div style={{ textAlign: "center", color: "red" }}>{error}</div>;

  return (
    <div className="view-post-page">
    <div className="container">
      <h2 className="heading">Posts</h2>

      {posts.length > 0 ? (
        <div className="posts-container">
          {posts.map((post) => (
            <div key={post._id} className="post">
              {/* تاريخ النشر */}
              <p className="posted-date">
                Posted on: {format(new Date(post.createdAt), "MMM dd, yyyy HH:mm")}
              </p>

              {/* صورة الملف الشخصي + اسم المستخدم */}
              {post.userId.profileImage && (
                <img
                  className="post-profile-image"
                  src={`http://localhost:5000${post.userId.profileImage}`}
                  alt="Profile"
                />
              )}
              <Link to={`/users/${post.userId._id}`}>
                <p className="post-username">{post.userId.name}</p>
              </Link>

              {/* صورة المنشور */}
              {post.image && (
                <img
                  className="post-image"
                  src={`http://localhost:5000/${post.image}`}
                  alt="Post"
                />
              )}

              {/* نص المنشور */}
              <p className="post-text">{post.text}</p>

              {/* زر الإعجاب + زر إظهار التعليقات */}
              <div className="post-actions">
                <button
                  className={`like-button ${animateLike[post._id] ? "animated" : ""}`}
                  onClick={() => handleLike(post._id)}
                >
                  <i className="fas fa-heart"></i>
                  {post.likes?.length ?? 0}
                </button>

                <button
                  className="show-comments-btn"
                  onClick={() => handleShowComments(post._id)}
                >
                  <i className="fas fa-comments"></i> Show Comments
                </button>
              </div>

              {/* عدد الإعجابات + زر إظهار قائمة من قام بالإعجاب */}
              <p
                className="likes-list"
                onClick={() => handleShowLikes(post._id)}
                style={{ cursor: "pointer" }}
              >
                {post.likes?.length
                  ? `${post.likes.length} Like(s) - Click to see who liked`
                  : "No likes yet"}
              </p>

              {/* نافذة التعليقات (Modal) */}
              {activeCommentsPost === post._id && (
                <Modal
                  isOpen={true}
                  onClose={handleCloseComments}
                  title={`Comments for ${post.userId.name}'s Post`}
                >
                  <div>
                    {/* قائمة التعليقات */}
                    {post.comments?.map((comment) => (
                      <div key={comment._id} className="comment">
                        <img
                          src={`http://localhost:5000${comment.userId.profileImage}`}
                          alt="Profile"
                        />
                        <p>
                          <Link to={`/users/${comment.userId._id}`}>
                            {comment.userId.name}:
                          </Link>{" "}
                          {comment.comment}
                        </p>

                        {/* قائمة الردود */}
                        {comment.replies?.map((reply) => (
                          <div key={reply._id} className="reply"
                           
                             


                         
                          >
                            <img
                              src={`http://localhost:5000${reply.userId.profileImage}`}
                              alt="Profile"
                            />
                            <p>
                              <Link to={`/users/${reply.userId._id}`}>
                              {reply.userId.name}:
                              </Link>{" "}
                              {reply.reply}
                            </p>
                          </div>
                        ))}

                        {/* إضافة رد على التعليق */}
                        <div className="reply-section">
                          <input
                            type="text"
                            value={replyText[comment._id] || ""}
                            onChange={(e) =>
                              setReplyText({
                                ...replyText,
                                [comment._id]: e.target.value,
                              })
                            }
                            placeholder="Write a reply..."
                          />
                          <button onClick={() => handleReply(post._id, comment._id)}>
                            Reply
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* إدخال تعليق جديد */}
                    <div className="comments-section">
                      <input
                        type="text"
                        value={commentText[post._id] || ""}
                        onChange={(e) =>
                          setCommentText({ ...commentText, [post._id]: e.target.value })
                        }
                        placeholder="Write a comment..."
                      />
                      <button onClick={() => handleComment(post._id)}>Comment</button>
                    </div>
                  </div>
                </Modal>
              )}

              {/* نافذة الإعجابات (Modal) */}
              {activeLikesPost === post._id && (
                <Modal
                  isOpen={true}
                  onClose={handleCloseLikes}
                  title="Who Liked This Post?"
                >
                  <ul style={{ listStyle: "none", padding: 20 }}>
                    {post.likes?.map((user) => (
                      <li key={user._id} style={{ marginBottom: "10px" }}>
                        <Link
                          to={`/users/${user._id}`}
                          style={{ color: "#fff", textDecoration: "none" }}
                        >
                          <i className="fas fa-user"></i> {user.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Modal>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="no-posts">No posts found</p>
      )}
    </div>
    </div>
  );
}
