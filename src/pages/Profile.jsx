import { FaUser, FaEnvelope, FaCloudUploadAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaInfoCircle, FaSave, FaSpinner } from "react-icons/fa";

export default function Profile() {
  const [coverImage, setCoverImage] = useState(null);
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [posts, setPosts] = useState([]);
  const [numberOfFriends, setNumberOfFriends] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [AboutMe, setAboutMe] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [occupation, setOccupation] = useState("");
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [Education, setEducation] = useState("");
  const [workExperience, setWorkExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [socialMedia, setSocialMedia] = useState({
    linkedin: "",
    github: "",
    twitter: "",
  });
  const [Badges, setBadges] = useState([]);

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
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchPosts();
    fetchNumberofFriends();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAboutMe(user.AboutMe);
      setBirthday(user.birthday);
      setPhoneNumber(user.phoneNumber);
      setGender(user.gender);
      setCountry(user.country);
      setOccupation(user.occupation);
      setEducation(user.GeneralInfo.Education);
      setWorkExperience(user.GeneralInfo.workExperience);
      setSkills(user.GeneralInfo.skills);
      setSocialMedia(user.GeneralInfo.socialMedia);
      setBadges(user.Badges);
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/postusers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data.posts);
    } catch (err) {
      setError("Failed to fetch posts");
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
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCoverImageChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleUploadProfileImage = async () => {
    if (!file) {
      setError("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", file);

    setLoading(true); // Show loading state

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/profile/picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser(res.data.user);
      alert("Profile picture updated successfully");
    } catch (err) {
      setError("Failed to upload profile image");
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  const handleUploadCoverImage = async () => {
    if (!coverImage) {
      setError("No cover image selected");
      return;
    }

    const formData = new FormData();
    formData.append("coverImage", coverImage);

    setLoading(true); // Show loading state

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/profile/cover-picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser(res.data.user);
      alert("Cover image updated successfully");
    } catch (err) {
      setError("Failed to upload cover image");
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  const handlePersonalInfoUpdate = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/user/updatePersonalInfo",
        {
          birthday,
          phoneNumber,
          gender,
          country,
          occupation,
          name,
          email,
          AboutMe,
          Education,
          workExperience,
          skills,
          socialMedia,
          Badges,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setUser(res.data.user);
      alert("Personal information updated successfully!");
    } catch (err) {
      setError("Failed to update personal information");
    } finally {
      setSaving(false);
    }
  };

  const openImage = () => setIsImageOpen(true);
  const closeImage = () => setIsImageOpen(false);

  if (loading) return <div className="text-center text-xl">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="profile-container-main">
      <div className="cover-section-container">
        <div className="cover-upload-container">
          <label id="cover-upload-label" htmlFor="coverUpload">
            <FaCloudUploadAlt />
            <input
              type="file"
              id="coverUpload"
              onChange={handleCoverImageChange}
              style={{ display: "none" }}
            />
            Upload Cover
          </label>
          {/* Add cover image upload button */}
          <button
            className="modern-button upload-button"
            onClick={handleUploadCoverImage}
            disabled={loading}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                <FaSpinner />
              </motion.div>
            ) : (
              "Save"
            )}
          </button>
        </div>

        {user?.coverImage && (
          <img
            className="cover-image-container"
            src={`http://localhost:5000${user.coverImage}`}
            alt="Cover"
          />
        )}
      </div>

      <div id="profile">
        <div id="profile-image">
          <div>
            <img
              id="profileImage"
              src={`http://localhost:5000${user.profileImage}`}
              alt="Profile"
              onClick={openImage}
            />
          </div>

          <div className="profile-upload-container">
            <input
              type="file"
              id="profileUpload"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label id="profile-upload-label" htmlFor="profileUpload">
              <FaCloudUploadAlt />
              Change Photo
            </label>
            
            {/* Add profile image upload button */}
            <button
              className="modern-button upload-button"
              onClick={handleUploadProfileImage}
              disabled={loading}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  <FaSpinner />
                </motion.div>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>

        <div className="profile-header">
          <h1 id="profile-name">{user.name}</h1>
          <p id="profile-email" style={{ color: "#94a3b8" }}>
            {user.email}
          </p>

          <div className="stats-container">
            <div className="stat-box">
              <div className="stat-value">{posts.length}</div>
              <div className="stat-label">Posts</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{numberOfFriends}</div>
              <div className="stat-label">Friends</div>
            </div>
          </div>
        </div>

        <div className="edit-form-container">
          <div className="form-section">
            <h2 className="form-section-title">
              <FaUser
                id="Icon-form-section"
                style={{ marginRight: "0.5rem" }}
              />
              Personal Information
            </h2>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="modern-input"
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="modern-input"
              />
            </div>

            <div className="form-group">
              <label>Birthday</label>
              <input
                type="date"
                value={birthday ? birthday.split("T")[0] : ""}
                onChange={(e) => setBirthday(e.target.value)}
                className="modern-input"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="modern-input"
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="modern-input"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="modern-input"
              />
            </div>

            <div className="form-group">
              <label>Occupation</label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="modern-input"
              />
            </div>

            <div className="form-group">
              <label>About Me</label>
              <textarea
                value={AboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                className="modern-input"
              />
            </div>

            <div className="form-group">
              <label>Education</label>
              <input
                type="text"
                value={Education}
                onChange={(e) => setEducation(e.target.value)}
                className="modern-input"
              />
            </div>

            <div className="form-group">
              <label>Work Experience</label>
              <input
                type="text"
                value={workExperience}
                onChange={(e) => setWorkExperience(e.target.value)}
                className="modern-input"
              />
            </div>

            <div className="form-group">
              <label>Skills</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="modern-input"
              />
            </div>

            <div className="form-group">
              <label>Social Media</label>
              <input
                type="text"
                value={socialMedia.linkedin}
                onChange={(e) =>
                  setSocialMedia({
                    ...socialMedia,
                    linkedin: e.target.value,
                  })
                }
                className="modern-input"
                placeholder="LinkedIn"
              />
              <input
                type="text"
                value={socialMedia.github}
                onChange={(e) =>
                  setSocialMedia({ ...socialMedia, github: e.target.value })
                }
                className="modern-input"
                placeholder="GitHub"
              />
              <input
                type="text"
                value={socialMedia.twitter}
                onChange={(e) =>
                  setSocialMedia({ ...socialMedia, twitter: e.target.value })
                }
                className="modern-input"
                placeholder="Twitter"
              />
            </div>

            <div className="form-group">
              <label>Badges</label>
              <input
                type="text"
                value={Badges}
                onChange={(e) => setBadges(e.target.value)}
                className="modern-input"
              />
            </div>

            <div className="form-group">
              <button
                type="button"
                className="modern-button save-button"
                onClick={handlePersonalInfoUpdate}
                disabled={saving}
              >
                {saving ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  >
                    <FaSpinner />
                  </motion.div>
                ) : (
                  <FaSave />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
