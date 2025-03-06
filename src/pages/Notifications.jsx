import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiBell, FiCheckCircle, FiTrash2, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
  // استيراد ملف الـ CSS

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setNotifications(data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => 
        n._id === id ? { ...n, read: true } : n
      ));
      console.log('Notification marked as read');
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="notifications-container">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="header"
        >
          <FiBell size={28} className="bell-icon" />
          <h1 className="title">Notifications</h1>
        </motion.div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner" />
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="empty-state"
          >
            <FiCheckCircle size={48} />
            <p>No notifications</p>
          </motion.div>
        ) : (
          <motion.div 
            className="notifications-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {notifications.map((notification) => (
              <motion.div
                key={notification._id}
                className={`notification-card ${notification.read ? 'read' : ''}`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="notification-header">
                  <div className="status-indicator">
                    {!notification.read && <div className="unread-dot" />}
                  </div>
                  <div className="actions">
                    <button 
                      onClick={() => markAsRead(notification._id)}
                      className="action-button"
                    >
                      <FiCheckCircle />
                    </button>
                    <button
                      onClick={() => deleteNotification(notification._id)}
                      className="action-button"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                <p className="message">{notification.message}</p>
                
                <div className="time-stamp">
                  <FiClock size={14} />
                  <span>
                    {new Date(notification.createdAt).toLocaleString('EG', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
