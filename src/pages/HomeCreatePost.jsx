import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaCloudUploadAlt, FaPaperPlane } from "react-icons/fa";
  // استيراد ملف CSS
  import defaultProfile from "../assets/img/c0749b7cc401421662ae901ec8f9f660.jpg";

export default function HomeCreatePost() {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const text = e.target.text.value.trim();
    const image = e.target.image.files[0];

    if (!text) {
      alert("Please write something before posting.");
      return;
    }

    const formData = new FormData();
    formData.append("text", text);
    if (image) {
      formData.append("image", image);
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/postusers",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }  const handleImageError = (e, fallbackImage) => {
    e.target.src = fallbackImage;
  };


  return (
    <div className="home-create-post">
      <div className="home-create-post-header">
        <img
                       src={user.profileImage ? `http://localhost:5000${user.profileImage}` : defaultProfile}
                       alt="Profile"
                       onError={(e) => handleImageError(e, defaultProfile)} // Handle image error
                     />
        <h1>Create Post</h1>
      </div>

      <form onSubmit={handleCreatePost} className="create-post-form">
        <div>
          <textarea
            name="text"
            placeholder="What's on your mind?"
          />
        </div>

        <div className="file-upload">
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => setSelectedImage(e.target.files[0])}
            style={{ display: "none" }}
            id="fileInput"
          />
          <label htmlFor="fileInput">
            <div><FaCloudUploadAlt /></div>
            <div>{selectedImage ? selectedImage.name : 'Click to Upload'}</div>
          </label>

          {selectedImage && (
            <div>
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
              />
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
              >
                ×
              </button>
            </div>
          )}
        </div>

        <button type="submit">
          <FaPaperPlane />
          Publish
        </button>
      </form>

      <div className="create-posts-section">
        {/* عرض المنشورات المستقبلية */}
      </div>
    </div>
  );
}
