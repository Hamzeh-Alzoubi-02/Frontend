import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import defaultProfile from "../../assets/img/c0749b7cc401421662ae901ec8f9f660.jpg";

function GetProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        // التحقق من وجود التوكن
        if (!token) {
          setError("No authentication token found");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/get-projects", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📌 Fetched Projects:", res.data);

        // التحقق من وجود الحقل "projects" في البيانات المستلمة
        if (Array.isArray(res.data.projects)) {
          // تصفية المشاريع بحيث تظهر فقط المشاريع الموافق عليها
          const approvedProjects = res.data.projects.filter(
            (project) => project.statusProject.toLowerCase() === "approved"
          );

          setProjects(approvedProjects); // تحديث الحالة بالمشاريع الموافق عليها فقط
        } else {
          setError("Projects data is not in the expected format");
        }
      } catch (err) {
        setError(`Failed to fetch project details: ${err.message}`);
      } finally {
        setLoading(false); // إيقاف حالة التحميل
      }
    };

    fetchProjects();
  }, []);

  // تحديث عدد المشاهدات عند فتح المشروع
  const increaseViews = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      // إرسال الطلب لزيادة المشاهدات
      const response = await axios.put(
        `http://localhost:5000/api/increase-views/${projectId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // تحديث عدد المشاهدات محليًا بعد نجاح الطلب
      setProjects((prevProjects) =>
        prevProjects.map((proj) =>
          proj._id === projectId
            ? { ...proj, views: response.data.views }
            : proj
        )
      );
    } catch (error) {
      console.error(`Error increasing views for project ${projectId}:`, error);
    }
  };

  // إضافة تعليق مباشرة بعد الإرسال
  const handleComment = async (projectId) => {
    if (!comment || comment.trim() === "") {
      return alert("Please enter a valid comment.");
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/comment`,
        { projectId, comment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // إضافة التعليق مباشرة إلى المشروع
      setProjects((prevProjects) =>
        prevProjects.map((proj) =>
          proj._id === projectId
            ? { ...proj, comments: [...proj.comments, response.data] }
            : proj
        )
      );

      // مسح التعليق بعد الإرسال
      setComment("");
    } catch (error) {
      console.error(`Error adding comment to project ${projectId}:`, error);
    }
  };

  // إضافة إعجاب مباشرة بعد الإرسال
  const handleLike = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/like",
        { projectId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // إضافة الإعجاب مباشرة إلى المشروع
      setProjects((prevProjects) =>
        prevProjects.map((proj) =>
          proj._id === projectId
            ? { ...proj, likes: response.data.likes } // تحديث likes مباشرة
            : proj
        )
      );
    } catch (error) {
      console.error("Error liking the project:", error);
    }
  };

  const handleImageError = (e, fallbackImage) => {
    e.target.src = fallbackImage;
  };

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>{error}</p>;
  if (!projects.length) return <p>No approved projects found</p>;

  return (
    <div className="projects-container-Get-Project">
      <div className="projects-list-Get-Project">
        {projects.map((project) => {
          const averageRating =
            project.ratings && project.ratings.length > 0
              ? project.ratings.reduce((sum, r) => sum + r, 0) /
                project.ratings.length
              : 0;

          return (
            <div
              key={project._id}
              className="project-card-Get-Project"
              onClick={() => increaseViews(project._id)}
            >
              {/* Project Header */}
              <div className="project-header-Get-Project">
                <h2 className="project-title-Get-Project">{project.title}</h2>
                <span className="project-status-Get-Project">
                  {project.status}
                </span>
              </div>

              {/* Project Images */}
              {project.images?.length > 0 && (
                <div className="project-images-Get-Project">
                  {project.images.map((img, index) => (
                    <img
                      key={index}
                      src={`http://localhost:5000/uploads/${img}`}
                      alt={`Project Image ${index}`}
                      className="project-image-Get-Project"
                    />
                  ))}
                </div>
              )}

              {/* Project Details */}
              <div className="project-details-Get-Project">
                <p className="project-description-Get-Project">
                  <i className="fas fa-link" id="link-icon-Get-Project"></i>
                  <a
                    className="project-link-Get-Project"
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.link}
                  </a>
                </p>

                <div className="project-info-Get-Project">
                  <div className="project-views-Get-Project">
                    <i className="fas fa-eye"></i>
                    <span className="project-views-count-Get-Project">
                      {project.views}
                    </span>
                  </div>

                  <div className="project-likes-Get-Project">
                    <i className="fas fa-star" id="star"></i>
                    <span className="project-likes-count-Get-Project">
                      {averageRating.toFixed(1)}/5 (
                      {project.ratings?.length || 0})
                    </span>
                  </div>
                </div>

                {project.tags?.length > 0 && (
                  <div className="project-tags-Get-Project">
                    {project.tags.map((tag, index) => (
                      <span className="project-tag-Get-Project" key={index}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Like Section */}
              <div className="like-section-Get-Project">
                <button
                  className="like-button-Get-Project"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(project._id);
                  }}
                >
                  <i
                    className="fas fa-heart"
                    id="like-button-Get-Project-icon"
                  ></i>
                  Like ({project.likes?.length || 0})
                </button>

                {project.likes?.length > 0 && (
                  <div className="likes-list-Get-Project">
                    {project.likes.map((like, index) => (
                      <div className="like-item-Get-Project" key={index}>
                        <img
                          src={
                            like.profileImage
                              ? `http://localhost:5000${like.profileImage}`
                              : defaultProfile
                          }
                          alt="Profile"
                          className="like-image-Get-Project"
                          onError={(e) => handleImageError(e, defaultProfile)} // Handle image error
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <div className="comments-section-Get-Project">
                <div className="comments-list-Get-Project">
                  <textarea
                    className="comment-input-Get-Project"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                  />
                  <button
                    className="comment-button-Get-Project"
                    onClick={() => handleComment(project._id)}
                    disabled={loading}
                  >
                    Post
                  </button>
                </div>

                {project.comments?.length > 0 && (
                  <div className="comments-list-Get-Project">
                    {project.comments.map((comment) => (
                      <div
                        className="comment-item-Get-Project"
                        key={comment._id}
                      >
                        <div className="comment-user-Get-Project">
                          {/* Check if userId exists and has profileImage */}
                          <img
                            src={
                              comment.userId?.profileImage
                                ? `http://localhost:5000${comment.userId.profileImage}`
                                : defaultProfile
                            }
                            alt="Profile"
                            className="like-image-Get-Project"
                            onError={(e) => handleImageError(e, defaultProfile)} // Handle image error
                          />
                          <Link
                            className="comment-username-Get-Project"
                            to={`/users/${comment.userId?._id}`}
                          >
                            {comment.userId?.name || "Anonymous"}
                          </Link>
                        </div>
                        <p className="comment-text-Get-Project">
                          {comment.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GetProjects;
