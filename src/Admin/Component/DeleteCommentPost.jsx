import axios from "axios";
import { useEffect, useState } from "react";

export default function DeleteCommentPost() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/post", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setPosts(response.data);
      } catch (err) {
        setError("An error occurred while fetching the posts.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Delete comment function
  const deleteComment = async (postId, commentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/delete-comment-post/${commentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update state after deletion
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments.filter(
                  (comment) => comment._id !== commentId
                ),
              }
            : post
        )
      );
      alert("Comment deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the comment.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>List of Shared Posts 📝</h1>
  
      {loading && (
        <div style={styles.loadingContainer}>
          <div style={styles.loader}></div>
          <p style={styles.loadingText}>Loading...</p>
        </div>
      )}
  
      {error && (
        <div style={styles.errorContainer}>
          <span style={styles.errorIcon}>⚠️</span>
          <p style={styles.errorText}>{error}</p>
        </div>
      )}
  
      {!loading && posts.length === 0 && (
        <div style={styles.emptyState}>
          <img 
            src="/empty-posts.svg" 
            alt="Empty Posts"
            style={styles.emptyImage}
          />
          <p style={styles.emptyText}> No posts yet!</p>
        </div>
      )}
  
      <div style={styles.postsContainer}>
        {posts.map((post) => (
          <div key={post._id} style={styles.postCard}>
            <div style={styles.postHeader}>
              <div style={styles.userInfo}>
                
                <div>
                   <p style={styles.postDate}>
                      {post.createdAt && new Date(post.createdAt).toLocaleDateString('en-US')}
                  </p>
                </div>
              </div>
            </div>
  
            <p style={styles.postContent}>{post.text}</p>
 
            <div style={styles.commentsSection}>
              <h4 style={styles.commentsTitle}> Comments 💬 ({post.comments.length})</h4>
              
              {post.comments.length === 0 ? (
                <p style={styles.noComments}>No comments yet</p>
              ) : (
                post.comments.map((comment) => (
                  <div key={comment._id} style={styles.commentCard}>
                    <div style={styles.commentHeader}>
                      <span style={styles.commentAuthor}>Anonymous Commenter</span>
                      <button
                        onClick={() => deleteComment(post._id, comment._id)}
                        style={styles.deleteButton}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                    <p style={styles.commentText}>{comment.comment}</p>
                    <span style={styles.commentTime}>
                      {new Date(comment.date).toLocaleTimeString('en-US')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    padding: '2rem',
    background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
    minHeight: '100vh',
    color: '#fff',
    fontFamily: "'Inter', sans-serif"
  },
  mainTitle: {
    backdropFilter: 'blur(10px)',
    color: '#00f3ff',
    fontSize: '2.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '2rem',
      paddingBottom: '1.5rem',
      borderBottom: '2px solid rgba(255,255,255,0.1)'
    
  },
  postCard: {
    background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '1.5rem',
    padding: '1.5rem',
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'translateY(-3px)'
    }
  },
  postHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
   
  
  
  postDate: {
    color: '#636e72',
    fontSize: '0.9rem',
    margin: 0
  },
  postContent: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: '#2d3436',
    marginBottom: '1.5rem',
    whiteSpace: 'pre-line'
  },
  commentsSection: {
    borderTop: '2px solidrgb(44, 53, 90)',
    paddingTop: '1rem'
  },
  commentsTitle: {
    color: '#636e72',
    marginBottom: '1rem'
  },
  commentCard: {
    background: '#1a1a1a',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
    position: 'relative'
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem'
  },
  commentAuthor: {
    color: '#e74c3c',
    fontWeight: '500'
  },
  commentText: {
    color: '#34495e',
    margin: '0.5rem 0',
    lineHeight: '1.6'
  },
  commentTime: {
    color: '#7f8c8d',
    fontSize: '0.8rem',
    display: 'block',
    textAlign: 'left'
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    color: '#e74c3c',
    cursor: 'pointer',
    padding: '0.3rem 0.5rem',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    transition: 'background 0.2s ease',
    ':hover': {
      background: '#ff7675',
      color: '#fff'
    }
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '3rem'
  },
  loader: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #0984e3',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto'
  },
  loadingText: {
    color: '#636e72',
    marginTop: '1rem'
  },
  errorContainer: {
    background: '#ffeef0',
    color: '#c0392b',
    padding: '1rem',
    borderRadius: '8px',
    margin: '1rem 0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem'
  },
  errorIcon: {
    fontSize: '1.5rem'
  },
  errorText: {
    margin: 0
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem'
  },
  emptyImage: {
    width: '250px',
    opacity: '0.7',
    marginBottom: '1rem'
  },
  emptyText: {
    color: '#636e72',
    fontSize: '1.1rem'
  }
};

// Adding spinning animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
