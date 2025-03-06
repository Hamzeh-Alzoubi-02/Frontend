import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
 
import { FaCog, FaCheckCircle, FaTimesCircle, FaSearch } from 'react-icons/fa';

const AdminReviewPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/get-posts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // تأكد من أن البيانات تحتوي على خاصية 'post' وهي مصفوفة
        if (Array.isArray(response.data.post)) {
          setPosts(response.data.post);
        } else {
          setError("The fetched data does not contain a valid 'post' array.");
        }
      } catch (err) {
        setError("Failed to fetch posts.");
      }
    };

    fetchPosts();
  }, []);

  const handleApprove = async (postId) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/admin/posts/${postId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, status: "approved" } : post
          )
        );
      }
    } catch (err) {
      setError("Error approving post.");
    }
  };

  const handleReject = async (postId) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/admin/posts/${postId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
      }
    } catch (err) {
      setError("Error rejecting post.");
    }
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <Link to="/DeleteCommentPost" style={styles.settingsLink}>
          <FaCog style={styles.settingsIcon} />
          Manage Comments
        </Link>
        <h1 style={styles.title}>Posts Moderation Panel</h1>
      </div>

      {/* Search & Filters */}
      <div style={styles.searchContainer}>
        <div style={styles.searchInput}>
          <FaSearch style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search posts..." 
            style={styles.inputField}
          />
        </div>
      </div>

      {/* Posts List */}
      <div style={styles.content}>
        <h3 style={styles.sectionTitle}>
          Pending Review ({posts.length})
          <div style={styles.statusIndicator}></div>
        </h3>

        {error && <p style={styles.error}>{error}</p>}

        {posts.length === 0 ? (
          <div style={styles.emptyState}>
            <img src="/empty-state.svg" alt="No posts" style={styles.emptyImage} />
            <p style={styles.emptyText}>No posts pending review</p>
          </div>
        ) : (
          <div style={styles.postsGrid}>
            {posts.map((post) => (
              <div key={post._id} style={styles.postCard}>
                {/* Post Content */}
                <div style={styles.postHeader}>
                  <span style={styles.postStatus}>{post.status}</span>
                  <span style={styles.postDate}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p style={styles.postText}>{post.text}</p>

                {post.image && (
                  <div style={styles.imageContainer}>
                    <img
                      src={`http://localhost:5000/${post.image}`}
                      alt={post.text}
                      style={styles.postImage}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                {post.status === "pending" && (
                  <div style={styles.actions}>
                    <button 
                      onClick={() => handleApprove(post._id)}
                      style={styles.approveButton}
                    >
                      <FaCheckCircle style={styles.buttonIcon} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(post._id)}
                      style={styles.rejectButton}
                    >
                      <FaTimesCircle style={styles.buttonIcon} />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    padding: '2rem',
    background: 'linear-gradient(145deg, #0f0f0f, #1a1a1a)',
    minHeight: '100vh',
    color: '#fff',
    fontFamily: "'Inter', sans-serif"
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '2px solid rgba(255,255,255,0.1)'
  },
  settingsLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    color: '#00f3ff',
    textDecoration: 'none',
    padding: '0.8rem 1.2rem',
    borderRadius: '30px',
    background: 'rgba(0,243,255,0.1)',
    transition: 'all 0.3s ease',
    ':hover': {
      background: 'rgba(0,243,255,0.2)'
    }
  },
  title: {
    fontSize: '2rem',
    background: 'linear-gradient(45deg, #00f3ff, #2ecc71)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0
  },
  searchContainer: {
    marginBottom: '2rem'
  },
  searchInput: {
    position: 'relative',
    maxWidth: '500px'
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#b2bec3'
  },
  inputField: {
    width: '100%',
    padding: '0.8rem 1rem 0.8rem 2.5rem',
    borderRadius: '30px',
    border: '2px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    ':focus': {
      outline: 'none',
      borderColor: '#00f3ff',
      boxShadow: '0 0 15px rgba(0,243,255,0.2)'
    }
  },
  content: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '15px',
    padding: '2rem',
    backdropFilter: 'blur(10px)'
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    color: '#00f3ff',
    marginBottom: '1.5rem'
  },
  statusIndicator: {
    width: '12px',
    height: '12px',
    background: '#00f3ff',
    borderRadius: '50%',
    boxShadow: '0 0 10px rgba(0,243,255,0.5)'
  },
  postsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  postCard: {
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '15px',
    padding: '1.5rem',
    border: '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 25px rgba(0,243,255,0.2)'
    }
  },
  postHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  postStatus: {
    background: 'rgba(0,243,255,0.1)',
    color: '#00f3ff',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.9rem'
  },
  postDate: {
    color: '#b2bec3',
    fontSize: '0.9rem'
  },
  postText: {
    lineHeight: '1.6',
    marginBottom: '1rem'
  },
  imageContainer: {
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '1rem'
  },
  postImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    ':hover': {
      transform: 'scale(1.05)'
    }
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
  },
  approveButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.8rem',
    background: 'rgba(46,204,113,0.1)',
    border: '1px solid #2ecc71',
    color: '#2ecc71',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      background: 'rgba(46,204,113,0.2)'
    }
  },
  rejectButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.8rem',
    background: 'rgba(231,76,60,0.1)',
    border: '1px solid #e74c3c',
    color: '#e74c3c',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      background: 'rgba(231,76,60,0.2)'
    }
  },
  error: {
    color: '#e74c3c',
    padding: '1rem',
    background: 'rgba(231,76,60,0.1)',
    borderRadius: '10px',
    marginBottom: '1rem'
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem'
  },
  emptyImage: {
    width: '200px',
    marginBottom: '1rem'
  },
  emptyText: {
    color: '#b2bec3',
    fontSize: '1.2rem'
  },
  buttonIcon: {
    fontSize: '1.2rem'
  }
};

export default AdminReviewPosts;