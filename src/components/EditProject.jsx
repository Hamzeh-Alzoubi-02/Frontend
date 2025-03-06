import axios from "axios";
import { useState, useEffect } from "react";
import {
  FaCalendar,
  FaSpinner,
  FaTimes,
  FaBoxOpen,
  FaFileAlt,
  FaEdit,
  FaImage,
  FaTrash,
  FaCloudUploadAlt,
} from "react-icons/fa";

export default function EditProject() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [loading, setLoading] = useState(false); // لعرض حالة التحميل

  useEffect(() => {
    // جلب جميع المشاريع عند تحميل الصفحة
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/get-project-user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleProjectSelect = async (projectId) => {
    // تحديد المشروع الذي سيتم تعديله
    const project = projects.find((p) => p._id === projectId);
    setSelectedProjectId(projectId);
    setTitle(project.title);
    setDescription(project.description);
    setLink(project.link);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // تشغيل حالة التحميل

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("link", link);
      if (image) {
        formData.append("image", image);
      }

      // إرسال البيانات لتحديث المشروع
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:5000/api/edit-project/${selectedProjectId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Project updated successfully");
      setLoading(false); // إيقاف حالة التحميل
      setSelectedProjectId(null); // إعادة تعيين المشروع المحدد
      setTitle("");
      setDescription("");
      setLink("");
      setImage(null);
    } catch (error) {
      setLoading(false); // إيقاف حالة التحميل في حال حدوث خطأ
      alert("Error updating project");
      console.error("Error updating project:", error);
    }
  };
  const handleDelete = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:5000/api/delete-project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Project deleted successfully");
      // بعد الحذف، يمكن إعادة تحميل البيانات
      setProjects(projects.filter((project) => project._id !== projectId));
    } catch (error) {
      alert("Error deleting project");
      console.error("Error deleting project:", error);
    }
  };
  return (
    <div className="EditProject">
      <div className="edit-project-container">
        <h1 className="edit-project-title">All Projects</h1>

        {projects.length === 0 ? (
          <div className="no-projects">
            <FaBoxOpen className="no-projects-icon" />
            <p>No projects found</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div className="project-card" key={project._id}>
                {/* Project Image */}
                {project.images?.length > 0 && (
                  <div className="project-image">
                    <img
                      src={`http://localhost:5000/uploads/${project.images[0]}`}
                      alt="Project"
                      className="project-image-img"
                    />
                    <div className="project-image-count">
                      <FaImage className="project-image-icon" />
                      {project.images.length} Photos
                    </div>
                  </div>
                )}

                {/* Project Details */}
                <h2 className="project-title">{project.title}</h2>

                <p className="project-status">{project.statusProject}</p>

                <p className="project-description">{project.description}</p>

                <div className="project-status-container">
                <div
  className={`project-status-tag ${
    project.status === "Active" ? "active-status" : "inactive-status"
  }`}
>
  {project.status}
</div>

                </div>

                {/* Action Buttons */}
                <div className="project-actions">
                  <button
                    className="project-action-btn"
                    onClick={() => handleProjectSelect(project._id)}
                  >
                    <FaEdit className="project-action-icon" />
                    Edit
                  </button>

                  <button
                    className="project-action-btn-delete"
                    onClick={() => handleDelete(project._id)}
                  >
                    <FaTrash className="project-action-icon-delete-icon" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Project Modal */}
        {selectedProjectId && (
          <div className="edit-project-modal">
            <div className="edit-project-modal-content">
              <button
                className="edit-project-modal-close"
                onClick={() => setSelectedProjectId(null)}
              >
                <FaTimes />
              </button>

              <h2 className="edit-project-modal-title">Edit Project</h2>

              <form onSubmit={handleSubmit} className="edit-project-modal-form">
                <div>
                  <label className="edit-project-modal-label">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="edit-project-modal-input"
                    required
                  />
                </div>

                <div>
                  <label className="edit-project-modal-label-description">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="edit-project-modal-input"
                    required
                  />
                </div>

                <div>
                  <label className="edit-project-modal-label">
                    Project Link
                  </label>
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="edit-project-modal-input"
                    required
                  />
                </div>

                <div>
                  <label className="edit-project-modal-label-image">
                    Upload Image
                  </label>
                  <div className="edit-project-modal-image-upload">
                    <input
                      type="file"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                      id="fileInput"
                    />
                    <label
                      className="edit-project-modal-image-upload-label"
                      htmlFor="fileInput"
                    >
                      <FaCloudUploadAlt className="edit-project-modal-image-upload-icon" />
                      <div className="edit-project-modal-image-upload-text">
                        Click to upload
                      </div>
                      <div className="edit-project-modal-image-upload-hint">
                        PNG, JPG, GIF (Max 5MB)
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="edit-project-modal-submit"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="fa-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Project"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
