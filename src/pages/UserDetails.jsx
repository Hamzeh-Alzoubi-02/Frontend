import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import defaultProfile from "../assets/img/c0749b7cc401421662ae901ec8f9f660.jpg";
export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState(0); // تخزين التقييم
  const [skill, setSkill] = useState(""); // تخزين المهارة التي يتم تقييمها
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friend, setFriend] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res.data);
        setUser(res.data.user);
      } catch (err) {
        setError("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleRatingChange = (star) => {
    setRating(star);
  };

  const handleSkillChange = (event) => {
    setSkill(event.target.value);
  };

  const handleSubmitRating = async () => {
    if (!skill || rating === 0) {
      alert("Please select both a skill and a rating");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/add-rating/${id}`,
        { skill, rating, ratedBy: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data);
    } catch (err) {
      console.error("Error submitting rating", err);
    }
  };

  const renderStars = (averageRating) => {
    const fullStars = Math.floor(averageRating);
    const halfStar = averageRating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="stars">
        {Array(fullStars)
          .fill("★")
          .map((_, i) => (
            <span key={i} className="full-star">
              ★
            </span>
          ))}
        {halfStar && <span className="half-star">☆</span>}
        {Array(emptyStars)
          .fill("☆")
          .map((_, i) => (
            <span key={i} className="empty-star">
              ☆
            </span>
          ))}
      </div>
    );
  };
  const handleFriedRequest = async (friendId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/send-friend-request/${friendId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFriend(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Error submitting rating", err);
    }
  };
  const handleImageError = (e, fallbackImage) => {
    e.target.src = fallbackImage;
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="user-details">
      {/* Cover Section */}
      <div className="cover-image-user-details">
        <img
          src={`http://localhost:5000${user.coverImage}`}
          alt="Cover"
          className="cover-image-user-details-cover"
        />
        <div className="cover-image-user-details-cover-text">
        <img
  className="profile-image-container-user-details"
  src={
    user.profileImage
      ? `http://localhost:5000${user.profileImage}`
      : defaultProfileImage
  }
  alt="Profil"
  onError={(e) => handleImageError(e, defaultProfile)} // Handle image error
  loading="lazy" // إضافة lazy loading لتحميل الصورة عند ظهورها فقط
/>

        </div>
      </div>

      {/* Profile Header */}
      <div className="profile-info-container-user-details">
        <h3 className="profile-name-user-details">
          <div>
            {/* Friends Button */}
            <button
              className="friends-button-container-user-details"
              onClick={() => handleFriedRequest(user._id)}
            >
              <i className="fa fa-user-plus-user-details"></i>
            </button>
          </div>

          {user.name}
        </h3>
        <p className="user-role-user-details">{user.role}</p>
      </div>

      {/* Main Content Grid */}
      <div className="main-content-user-details">
        {/* Left Column */}
        <div style={{ position: "relative" }}>
          {/* Personal Info Card */}
          <div className="personal-info-card-user-details">
            <h4 className="personal-info-card-title-user-details">
              <i className="fas fa-user-circle-user-details"></i>
              Personal Information
            </h4>

            <div style={{ display: "grid", gap: "20px" }}>
              {[
                {
                  icon: "fas fa-info-circle",
                  label: "About Me",
                  value: user.personalInfo?.AboutMe,
                },
                {
                  icon: "fas fa-birthday-cake",
                  label: "Birthday",
                  value: user.personalInfo?.birthday,
                },
                {
                  icon: "fas fa-phone",
                  label: "Phone",
                  value: user.personalInfo?.phoneNumber,
                },
                {
                  icon: "fas fa-venus-mars",
                  label: "Gender",
                  value: user.personalInfo?.gender,
                },
                {
                  icon: "fas fa-globe",
                  label: "Country",
                  value: user.personalInfo?.country,
                },
                {
                  icon: "fas fa-briefcase",
                  label: "Occupation",
                  value: user.personalInfo?.occupation,
                },
              ].map((item, index) => (
                <div
                  className="personal-info-card-item-user-details"
                  key={index}
                >
                  <i
                    className={`${item.icon} fa-lg`}
                    style={{
                      color: "#00f3ff",
                      width: "30px",
                      textAlign: "center",
                    }}
                  ></i>
                  <div>
                    <div className="personal-info-card-label-user-details">
                      {item.label}
                    </div>
                    <div className="personal-info-card-value-user-details">
                      {item.value || "N/A"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/*  */}

        {/* Right Column */}
        <div>
          {/* Ratings Section */}
          <div className="ratings-section-user-details">
            <div className="ratings-section-user-details-header">
              <h4 className="ratings-section-title-user-details">
                <i className="fas fa-star"></i>
                Average Rating
              </h4>
              {user.level && (
                <div className="ratings-section-user-details-level">
                  Level {user.level}
                </div>
              )}
            </div>

            <div className="ratings-section-user-details-body">
              {user.averageRating ? (
                <>
                  {user.averageRating}
                  <div style={{ marginTop: "10px" }}>
                    {renderStars(user.averageRating)}
                  </div>
                </>
              ) : (
                "No ratings yet"
              )}
            </div>

            <div className="ratings-list">
              <h4 className="ratings-list-title-user-details">
                <i className="fas fa-comments"></i>
                User Ratings
              </h4>

              {user.ratings && user.ratings.length > 0 ? (
                <div
                  style={{
                    maxHeight: "400px",
                    overflowY: "auto",
                    paddingRight: "10px",
                  }}
                >
                  {user.ratings.map((rating, index) => (
                    <div
                      key={index}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        borderRadius: "15px",
                        padding: "20px",
                        marginBottom: "15px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                        }}
                      >
                        <div style={{ color: "#00f3ff", fontWeight: "600" }}>
                          {rating.ratedBy?.name || "Unknown"}
                        </div>
                        <div style={{ color: "#b2bec3", fontSize: "0.9rem" }}>
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                          marginBottom: "10px",
                        }}
                      >
                        <span style={{ color: "#f1c40f" }}>
                          {rating.skill || "General"}
                        </span>
                        <div
                          className="rating-stars"
                          style={{ display: "flex", gap: "5px" }}
                        >
                          {renderStars(rating.rating)}
                        </div>
                      </div>
                      {rating.comment && (
                        <p style={{ color: "#b2bec3", margin: "0" }}>
                          "{rating.comment}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#b2bec3",
                  }}
                >
                  No ratings available.
                </div>
              )}
            </div>
          </div>

          {/* Add Rating Section */}
          <div className="add-rating-section-user-details">
            <h4 className="add-rating-section-user-details-title">
              <i className="fas fa-edit"></i>
              Rate this User
            </h4>

            <div style={{ marginBottom: "20px" }}>
              <div className="rating-stars-user-details">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    className="rating-star-user-details"
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "2.5rem",
                      color: star <= rating ? "#f1c40f" : "#4a4a4a",
                      transition: "all 0.3s ease",
                      transform: star <= rating ? "scale(1.2)" : "scale(1)",
                      filter:
                        star <= rating
                          ? "drop-shadow(0 0 8px rgba(241,196,15,0.5))"
                          : "none",
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <input
                className="skill-input-user-details "
                type="text"
                placeholder="Skill (e.g., JavaScript)"
                value={skill}
                onChange={handleSkillChange}
              />
            </div>

            <button
              className="submit-button-user-details"
              onClick={handleSubmitRating}
            >
              Submit Rating
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
