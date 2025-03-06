import React, { useState } from "react";
import axios from "axios";
import { FaBullhorn, FaComment, FaPaperPlane, FaSpinner, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const SendNotification = () => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const sendNotification = async () => {
    if (!message.trim()) {
      setStatus({ success: false, message: "لا يمكن إرسال إشعار فارغ" });
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem("token"); 
      const response = await axios.post(
        "http://localhost:5000/api/admin/sentNotification",
        { text: message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatus({ success: true, message: "تم إرسال الإشعار بنجاح" });
      setMessage("");
    } catch (error) {
      setStatus({ success: false, message: "حدث خطأ أثناء إرسال الإشعار" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="send-notification"
     style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #1a1a1a, #0a0a0a)",
        backdropFilter: "blur(10px)",
      }}
    > 
    <div style={styles.container}>
      <h2 style={styles.header}>
        <FaBullhorn style={styles.headerIcon} />
        إرسال إشعار عام
      </h2>

      <div style={styles.formContainer}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            <FaComment style={styles.inputIcon} />
            محتوى الإشعار
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="اكتب محتوى الإشعار هنا..."
            style={styles.textarea}
            maxLength="500"
          />
          <div style={styles.counter}>{message.length}/500</div>
        </div>

        <button onClick={sendNotification} style={styles.sendButton} disabled={sending}>
          {sending ? (
            <>
              <FaSpinner className="fa-spin" />
              جاري الإرسال...
            </>
          ) : (
            <>
              <FaPaperPlane />
              إرسال الإشعار
            </>
          )}
        </button>
      </div>

      {status && (
        <div
          style={{
            ...styles.statusAlert,
            background: status.success ? "#2ecc7120" : "#e74c3c20",
            borderColor: status.success ? "#2ecc71" : "#e74c3c",
          }}
        >
          {status.success ? <FaCheckCircle style={{ color: "#2ecc71" }} /> : <FaTimesCircle style={{ color: "#e74c3c" }} />}
          <p style={styles.statusText}>{status.message}</p>
        </div>
      )}
    </div>
    </div>
  );
};

// الأنماط
const styles = {
  
  container: {
    width: "500px",
    
    padding: "2rem",
    background: "linear-gradient(145deg, #0a0a0a, #1a1a1a)",
    borderRadius: "15px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    color: "#00f3ff",
    fontSize: "2rem",
    marginBottom: "2rem",
    borderBottom: "2px solid rgba(0,243,255,0.2)",
    paddingBottom: "1rem",
  },
  headerIcon: {
    fontSize: "1.8rem",
  },
  formContainer: {
    padding: "1.5rem",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "12px",
    backdropFilter: "blur(10px)",
  },
  inputGroup: {
    marginBottom: "2rem",
    position: "relative",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    color: "#b2bec3",
    marginBottom: "1rem",
    fontSize: "1.1rem",
  },
  inputIcon: {
    color: "#00f3ff",
    fontSize: "1.3rem",
  },
  textarea: {
    width: "100%",
    minHeight: "150px",
    padding: "1.5rem",
    background: "rgba(0,0,0,0.3)",
    border: "2px solid rgba(0,243,255,0.2)",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "1rem",
    lineHeight: "1.8",
    transition: "all 0.3s ease",
  },
  counter: {
    position: "absolute",
    bottom: "15px",
    left: "15px",
    color: "#b2bec3",
    fontSize: "0.9rem",
  },
  sendButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.8rem",
    width: "100%",
    padding: "1.2rem",
    background: "linear-gradient(45deg, #00f3ff, #2ecc71)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  statusAlert: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1.5rem",
    marginTop: "2rem",
    borderRadius: "10px",
    border: "2px solid",
  },
  statusText: {
    margin: "0",
    fontSize: "1rem",
  },
};

export default SendNotification;
