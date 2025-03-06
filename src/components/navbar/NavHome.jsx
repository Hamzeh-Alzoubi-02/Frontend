import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaHome,
  FaUsers,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaCloudUploadAlt,
  FaPencilAlt,
  FaRegNewspaper,
  FaHandshake,
  FaBars, // أيقونة الهامبرغر لفتح القائمة
  FaUserAlt,
  FaAddressBook
} from "react-icons/fa";

export default function NavHome() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // حالة التحكم في القائمة

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // التبديل بين فتح وغلق القائمة
  };

  return (
    <nav className="nav-home">
      {/* Logo */}
      <div className="nav-home__logo">PADEL</div>

      {/* زر الهامبرغر لفتح أو غلق القائمة */}
      <button className="menu-toggle" onClick={toggleMenu}>
        <FaBars style={{ fontSize: "1.5rem", color: "#fff" }} />
      </button>

      {/* Icon Links Section - Left Side */}
      <div className={`nav-home__icons-left ${isMenuOpen ? "open" : ""}`}>
        <Link to="/Home" className="nav-link">
          <FaHome style={{ fontSize: "1.4rem" }} />
        </Link>

        <Link to="/users" className="nav-link">
          <FaUsers style={{ fontSize: "1.4rem" }} />
        </Link>

        <Link to="/view-profile" className="nav-link">
          <FaUser style={{ fontSize: "1.4rem" }} />
        </Link>
        <Link to='/friends' className="nav-link">
        <FaAddressBook style={{ fontSize: "1.4rem" }} />
         
        </Link>
         
      </div>

      {/* Icon Links Section - Right Side */}
      <div className={`nav-home__icons-right ${isMenuOpen ? "open" : ""}`}>
        <Link to="/notification" className="nav-link">
          <FaBell style={{ fontSize: "1.4rem" }} />
        </Link>

        <Link to="/view-psot" className="nav-link">
          <FaRegNewspaper style={{ fontSize: "1.4rem" }} />
        </Link>

        <Link to="/upload-project" className="nav-link">
          <FaCloudUploadAlt style={{ fontSize: "1.4rem" }} />
        </Link>

        <Link to="/createpost" className="nav-link">
          <FaPencilAlt style={{ fontSize: "1.4rem" }} />
        </Link>

        <Link to="/request" className="nav-link">
          <FaHandshake style={{ fontSize: "1.4rem" }} />
        </Link>
      </div>

      {/* Settings Dropdown - Last Item */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="nav-link"
        >
          <FaCog style={{ fontSize: "1.4rem" }} />
        </button>

        {isSettingsOpen && (
          <div className="settings-dropdown">
            <Link to="/settings" className="dropdown-item">
              Settings
            </Link>
            <button className="logout-btn">
              <FaSignOutAlt style={{ marginRight: "8px" }} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
