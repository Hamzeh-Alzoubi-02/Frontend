import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Render star ratings (full, half, empty)
const renderStars = (rating) => {
  const fullStars = Math.floor(rating); // النجوم الممتلئة
  const halfStar = rating % 1 >= 0.5 ? 1 : 0; // إذا كان التقييم يحتوي على نصف نجمة
  const emptyStars = 5 - fullStars - halfStar; // النجوم الفارغة

  return (
    <div className="stars">
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="star filled">★</span>
      ))}
      {halfStar === 1 && <span className="star half">☆</span>} {/* نصف نجمة */}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="star">☆</span>
      ))}
    </div>
  );
};

export default function ViewProfile() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [numberOfFriends, setNumberOfFriends] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        setError("Failed to fetch user data");
        console.error(err);
      }
    };

    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/postusers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data.posts);
      } catch (err) {
        setError("Failed to fetch posts");
        console.error(err);
      }
    };

    const fetchNumberofFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/number-of-friends",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNumberOfFriends(res.data.numberOfFriends);
      } catch (err) {
        setError("Failed to fetch number of friends");
        console.error(err);
      }
    };

    fetchProfile();
    fetchPosts();
    fetchNumberofFriends();
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const totalRating = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return totalRating / ratings.length;
  };

  const averageRating = calculateAverageRating(user.ratings);
 
  return (
    <div className="profile-container-view">
      <div className="profile-container-view-content">
        {/* Cover Section with Animated Background */}
        <div className="cover-section-view">
          <div className="cover-section-view-gradient"></div>

          {user.coverImage && (
            <img
              className="cover-image-view"
              src={`http://localhost:5000${user.coverImage}`}
              alt="Cover"
            />
          )}

          {/* Profile Image with Glow Effect */}
          <div className="profile-image-view">
            {user.profileImage && (
              <img
                className="profile-image-view-image"
                src={`http://localhost:5000${user.profileImage}`}
                alt="Profile"
              />
            )}
            <div className="profile-image-view-glow"></div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content-view" style={{ padding: "140px 60px 60px", position: "relative" }}>
          {/* Name and Title Section */}
          <div className="name-title-section-view">
            <h1 className="name-view">{user.name}</h1>
            <div className="title-view">{user.occupation || "Digital Creator"}</div>
            <div className="stars-view">{renderStars(averageRating)}</div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid-view">
            {[
              { title: "Posts", value: posts.length },
              { title: "Friends", value: numberOfFriends },
              { title: "Badges", value: user.Badges || 0 },
              { title: "Rating", value: averageRating.toFixed(1) },
            ].map((item, index) => (
              <div key={index} className="stats-grid-item-view">
                <div className="stats-grid-item-value-view">{item.value}</div>
                <div className="stats-grid-item-title-view">{item.title}</div>
              </div>
            ))}
          </div>

          {/* Main Content Section */}
          <div className="main-content-view">
            {/* Left Column */}
            <div>
              {/* About Card */}
              <div className="about-card-view">
                <div className="about-card-glow-view"></div>
                <h2 className="about-card-title-view">About Me</h2>
                <p className="about-card-description-view">
                  {user.AboutMe || "No information available"}
                </p>
              </div>

              {/* Experience Timeline */}
              <div className="experience-timeline-view">
                <h2 className="experience-timeline-title-view">
                  <i className="fas fa-rocket" id="rocket-icon"></i> Experience
                </h2>
                <div className="timeline-view">
                  {user.workExperience ? (
                    <div className="timeline-item-view">
                      <div className="timeline-dot-view"></div>
                      <div className="timeline-content-view">
                        {user.workExperience}
                      </div>
                    </div>
                  ) : (
                    <div className="no-experience-view">No experience listed</div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Contact Card */}
              <div className="contact-card-view">
                <h2 className="contact-card-title-view">
                  <i id="contact-icon" className="fas fa-id-card"></i> Contact
                </h2>
                <div className="contact-card-info-view">
                  {[
                    { icon: "fas fa-at", value: user.email },
                    { icon: "fas fa-mobile-alt", value: user.phoneNumber },
                    { icon: "fas fa-map-marked-alt", value: user.country },
                    { icon: "fas fa-birthday-cake", value: user.birthday },
                    { icon: "fas fa-link", value: user.socialMedia },
                  ].map((item, index) => (
                    <div className="contact-card-info-item-view" key={index}>
                      <i id="contact-icon-2" className={`${item.icon} fa-lg`}></i>
                      <span className="contact-card-info-item-value-view">{item.value || "Not specified"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Grid */}
              {user.skills && (
                <div className="skills-grid-view">
                  <h2 className="skills-grid-title-view">
                    <i id="skills-icon" className="fas fa-code"></i> Skills
                  </h2>
                  <div className="skills-grid-items-view">
                    {Array.isArray(user.skills)
                      ? user.skills.map((skill, index) => (
                          <div className="skills-grid-item-view" key={index}>
                            {skill}
                          </div>
                        ))
                      : user.skills.split(",").map((skill, index) => (
                          <div className="skills-grid-item-view" key={index}>
                            {skill.trim()}
                          </div>
                        ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
