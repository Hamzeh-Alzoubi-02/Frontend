import React, { useState } from "react";
import axios from "axios";
  // إضافة الرابط إلى ملف CSS

const CreatePost = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      alert("Text is required!");
      return;
    }

    const formData = new FormData();
    formData.append("text", text);
    if (image) formData.append("image", image);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/postusers", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="container-create-post">
      <form onSubmit={handleSubmit} className="create-post-form">
        <h2 className="create-post-title">Create New Post</h2>

        {/* Text Input */}
        <div className="form-group-create-post">
          <label>
            <i className="fas fa-pen" style={{ marginRight: '0.5rem' }}></i>
            Post Content
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className="form-control-create-post"
          />
        </div>

        {/* Image Upload */}
        <div className="form-group-create-post">
          <label>
            <i className="fas fa-image" style={{ marginRight: '0.5rem' }}></i>
            Upload Image
          </label>

          <div className="dropzone-create-post">
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              style={{ display: 'none' }}
              id="fileInput"
            />
            <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
              <i className="fas fa-cloud-upload-alt"></i>
              <div className="drag-drop-text-create-post">
                {image ? image.name : 'Drag & Drop or Click to Upload'}
              </div>
              <div style={{ color: '#b2bec3', fontSize: '0.8rem' }}>
                (Max size: 5MB • PNG, JPG, GIF)
              </div>
            </label>
          </div>

          {image && (
            <div className="image-preview-create-post">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="preview-image-create-post"
              />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="delete-image-button-create-post"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button-create-post">
          <i className="fas fa-paper-plane"></i>
          Publish Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
