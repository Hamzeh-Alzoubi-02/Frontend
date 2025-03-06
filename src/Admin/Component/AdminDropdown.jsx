import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from 'react-icons/fa';
import { FaCog } from 'react-icons/fa'; 
const AdminDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button style={styles.acceptButton} onClick={toggleDropdown}>
        <FaCog style={styles.buttonIcon} />
      </button>

      {isOpen && (
        <div style={styles.dropdownMenu}>
          <Link to="/AcceptPost" style={styles.dropdownItem} onClick={() => setIsOpen(false)}>
            ✅ قبول المنشور
          </Link>
          <Link to="/AccpetProject" style={styles.dropdownItem} onClick={() => setIsOpen(false)}>
            ✅ قبول المشروع
          </Link>
          <Link to="/sentNotification" style={styles.dropdownItem} onClick={() => setIsOpen(false)}>
            ℹ️  إرسال تنبيه
          </Link>
        </div>
      )}
    </div>
  );
};

const styles = {
  acceptButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "1.5rem",
    color: "#4CAF50",
    transition: "0.3s",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: "0",
    background: "#1e1e1e",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    minWidth: "180px",
    zIndex: 10,
    animation: "fadeIn 0.3s ease-in-out",
  },
  dropdownItem: {
    display: "block",
    padding: "10px",
    color: "#fff",
    textDecoration: "none",
    transition: "0.3s",
  },
};

export default AdminDropdown;
