import { useEffect, useState } from "react";
import axios from "axios";
import { FaCalendar, FaFileAlt, FaEdit, FaImage, FaTrash,FaCloudUploadAlt } from "react-icons/fa";

export default function EditPost() {
    const [posts, setPosts] = useState([]);
    const [editingPostId, setEditingPostId] = useState(null); // لتحديد المنشور الذي يتم تحريره
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [status, setStatus] = useState('');

    // جلب المنشورات عند التحميل
    useEffect(() => {
        async function fetchPosts() {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get('http://localhost:5000/api/get-posts-by-user', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setPosts(response.data.posts);  // تعيين البيانات في الحالة
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        }
        fetchPosts();
    }, []);  // فارغة تعني أن العملية تتم فقط عند التحميل الأولي

    // التعامل مع تغيير النص
    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    // التعامل مع تغيير الصورة
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    // التعامل مع تحديث المنشور
    const handleSave = async (postId) => {
        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("text", text);
            if (image) formData.append("image", image);

            const response = await axios.put(
                `http://localhost:5000/api/postusers/${postId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            
            // تحديث المنشور في الواجهة
            setPosts(posts.map(post => post._id === postId ? response.data.post : post));
            setEditingPostId(null);  // إغلاق وضع التحرير
            setText('');
            setImage(null);

            alert("Post updated successfully!");
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Failed to update the post.");
        }
    };

    // التعامل مع حذف المنشور
    const handleDelete = async (postId) => {
        try {
            const token = localStorage.getItem("token");

            await axios.delete(`http://localhost:5000/api/postusers/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // إزالة المنشور من الواجهة بعد الحذف
            setPosts(posts.filter(post => post._id !== postId));

            alert("Post deleted successfully!");
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete the post.");
        }
    };

    return (
        <div className="EditPost-container"
        
        > 
        <div
        className="EditPost-container-inner"
        >
          <h1 
          className="EditPost-title"
         >Manage Posts</h1>
      
          {posts.length > 0 ? (
            <div 
            className="EditPost-posts"
            >
              {posts.map(post => (
                <div 
                className="EditPost-post"
                key={post._id} >
                  {editingPostId === post._id ? (
                    <div>
                      <div
                      className="EditPost-textarea-container"
                      style={{ position: 'relative', marginBottom: '1rem' }}>
                        <textarea
                          value={text}
                          onChange={handleTextChange}
                          placeholder="Update your post..."
                         
                        />
                        <span 
                        className="EditPost-textarea-length"
                       >
                          {text.length}/500
                        </span>
                      </div>
      
                      <div style={{ marginBottom: '1rem' }}>
                        <label
                        className="EditPost-image-label"
                      >
                          <input
                            type="file"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                          />
                          <FaCloudUploadAlt 
                          className="EditPost-image-icon"
                           />
                          Change Image
                        </label>
                      </div>
      
                      <div
                      className="EditPost-buttons"
                      >
                        <button
                        className="EditPost-button-save"
                          onClick={() => handleSave(post._id)}
                         
                        >
                          Save Changes
                        </button>
                        <button
                        className="EditPost-button-cancel"
                          onClick={() => setEditingPostId(null)}
                         
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p 
                      className="EditPost-text"
                      >{post.text}</p>
                      <div 
                      className="EditPost-status"
                      >

                         <span
                         
                         className="EditPost-status-text"
 >
                          Status  : {  post.status}
                        </span>
                      </div>
      
                      {post.image && (
                        <div
                        className="EditPost-image-container"
                        >
                          <img 
                            src={`http://localhost:5000/${post.image}`} 
                            alt={post.text}
                            className="EditPost-image"
                        
                          />
                          <div
                          className="EditPost-image-overlay"
                         >
                            <FaImage 
                            className="EditPost-image-icon"
                              />
                            Image
                          </div>
                        </div>
                      )}
      
                      <div 
                      className="EditPost-info"
                      >
                        <span>
                          <FaCalendar
                          className="EditPost-info-icon"
                           />
                          {new Date(post.createdAt).toLocaleString()}
                        </span>
                        <div>
                          <button
                          className="EditPost-button-edit"
                            onClick={() => {
                              setEditingPostId(post._id);
                              setText(post.text);
                            }}
                         
                          >
                            <FaEdit 
                            className="EditPost-info-icon"
                          />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(post._id)}
                            className="EditPost-button-delete"
                            
                          >
                            <FaTrash
                            className="EditPost-info-icon"
                            />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No posts found.</p>
          )}
        </div>
        </div>
    );
}
