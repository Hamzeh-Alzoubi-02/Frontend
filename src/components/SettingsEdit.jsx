import { Link } from "react-router-dom";
import { FaCog, FaTimes, FaEdit, FaUser, FaProjectDiagram } from "react-icons/fa";
   // Importing the CSS file

export default function SettingsEdit() {
  return (
    <div className="settings-container">
      <div className="settings-edit-container">
        {/* Animated Header */}
        <div className="settings-edit-header">
          <div className="icon-glow-container">
            <FaCog className="icon-glow-animation" size={40} />
          </div>
          <span className="settings-edit-title">Settings Panel</span>
        </div>

        {/* Sections with Enhanced Effects */}
        <EditSection
          title="Edit Post"
          icon={<FaEdit size={24} />}
          linkTo="/edit-posts/:userId"
          gradient="linear-gradient(45deg, #00f3ff, #2ecc71)"
        />
        <EditSection
          title="Edit Profile"
          icon={<FaUser size={24} />}
          linkTo="/profile"
          gradient="linear-gradient(45deg, #ff6b6b, #ffd93d)"
        />
        <EditSection
          title="Edit Project"
          icon={<FaProjectDiagram size={24} />}
          linkTo="/edit-project"
          gradient="linear-gradient(45deg, #6c5ce7, #a66efa)"
        />
      </div>
    </div>
  );
}

function EditSection({ title, icon, linkTo, gradient }) {
  return (
    <Link className="settings-edit-section-link" to={linkTo}>
      <div className="settings-edit-section">
        <div className="settings-edit-section-content">
          <div
            className="icon-container"
            style={{ background: gradient }}
          >
            {icon}
          </div>
          <h2 className="settings-edit-section-title">{title}</h2>
        </div>
        <div className="close-icon-container">
          <FaTimes className="close-icon" size={20} />
        </div>
      </div>
    </Link>
  );
}
