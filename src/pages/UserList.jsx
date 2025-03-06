import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import defaultProfileImage from "../assets/img/0b0266aa3f750eb120b72745ffa104b7.jpg"; 
import defaultProfile from "../assets/img/c0749b7cc401421662ae901ec8f9f660.jpg";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useCallback to memoize the fetchUsers function and prevent unnecessary re-renders
  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);
      setUsers(res.data.users);
    } catch (err) {
      setError("فشل تحميل المستخدمين");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle loading and error states
  if (loading) return <div className="loading">جارِ التحميل...</div>;
  if (error) return <div className="error">{error}</div>;

  // Helper function to handle image errors
  const handleImageError = (e, fallbackImage) => {
    e.target.src = fallbackImage;
  };

  return (
    <div className="users-containers">
      {users.map((user) => (
        <div key={user._id} className="user-cards">
          {/* Cover Image with Gradient Overlay */}
          <div className="cover-images">
            <img
              src={user.coverImage ? `http://localhost:5000${user.coverImage}` : defaultProfileImage}
              alt="Cover"
            />
            <div className="profile-image-container">
              <img
                src={user.profileImage ? `http://localhost:5000${user.profileImage}` : defaultProfileImage}
                alt="Profile"
                onError={(e) => handleImageError(e, defaultProfile)} // Handle image error
              />
            </div>
          </div>

          {/* User Info Section */}
          <div className="user-infos-user-list">
            <Link to={`/users/${user._id}`} className="user-name-user-list">
              {user.name}
              <span className="underline-user-list"></span>
            </Link>

            {/* Badges Section */}
            <div className="badges-user-list">
              <div className="badge-user-list-level">Level {user.level}</div>
            </div>

            {/* Education & Skills */}
            <div className="education-skills-user-list">
              <div className="education-user-list">
                <i className="fas fa-graduation-cap" style={{ color: "#2ecc71" }}></i>
                <p className="education-user-list-text">
                  {user.GeneralInfo.Education || "No education info"}
                </p>
              </div>

              <div className="skills-user-list">
                <i className="fas fa-code" style={{ color: "#f1c40f" }}></i>
                <div className="skills-user-list-text">
                  {Array.isArray(user.GeneralInfo.skills) && user.GeneralInfo.skills.length > 0 ? (
                    user.GeneralInfo.skills.map((skill, index) => (
                      <span className="skill-users-list" key={index}>
                        {skill.trim()}
                      </span>
                    ))
                  ) : (
                    <span>No skills available</span> // نص بديل إذا كانت skills فارغة أو غير موجودة
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Hover Effect Elements */}
          <div className="hover-effect-user-list"></div>
        </div>
      ))}
    </div>
  );
}
