import { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { FaUsers, FaUserShield, FaChartLine,FaUnlockAlt, FaLock, FaCheckCircle,  FaUser } from 'react-icons/fa';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,  // إضافة Filler
} from "chart.js";
import { Link } from "react-router-dom";
import AdminDropdown from "../Component/AdminDropdown";

// إعداد Chart.js مع تسجيل Filler
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler  // التسجيل هنا
);

const AdminDashbord = () => {
  const [users, setUsers] = useState([]); // تخزين المستخدمين
  const [statistics, setStatistics] = useState(null); // تخزين الإحصائيات
  const [loading, setLoading] = useState(true); // حالة التحميل
  const [error, setError] = useState(""); // حالة الخطأ

  useEffect(() => {
    // دالة لتحميل البيانات
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data); // تعيين بيانات المستخدمين
      } catch (err) {
        setError("Failed to load users"); // في حال حدوث خطأ
      } finally {
        setLoading(false); // الانتهاء من التحميل
      }
    };

    const fetchStatistics = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/statistics", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setStatistics(data); // تعيين الإحصائيات
        } else {
          setError(data.message); // في حال حدوث خطأ في الإحصائيات
        }
      } catch (err) {
        setError("Error fetching statistics"); // في حال حدوث خطأ أثناء تحميل الإحصائيات
      }
    };

    fetchUsers();
    fetchStatistics();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // عرض الرسالة أثناء التحميل
  }

  if (error) {
    return <div>{error}</div>; // عرض الخطأ إذا حدث
  }

  // بيانات الرسم البياني
  const chartData = {
    labels: statistics ? statistics.totalUsersByRole.map(roleStats => roleStats._id) : [],
    datasets: [
      {
        label: "Users by Role",
        data: statistics ? statistics.totalUsersByRole.map(roleStats => roleStats.count) : [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true, // ملء المنطقة أسفل الخط
      },
    ],
  };

  // دالة لتغيير حالة المستخدم (حظر / فك الحظر)
  const toggleUserStatus = async (userId, isBlocked) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/admin/users/${userId}/status`,
        { status: !isBlocked },  // تغيير الحالة
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (response.status === 200) {
        console.log("User status updated successfully");
        // تحديث واجهة المستخدم بعد التحديث
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isBlocked: !isBlocked } : user
          )
        );
      }
    } catch (error) {
      console.error("Error updating user status", error);
    }
  };


  const makeAdmin = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/user/admin/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // تحديث قائمة المستخدمين بعد تغيير الدور
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: "admin" } : user
        )
      );
      alert("تم تحويل المستخدم إلى Admin بنجاح.");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء تحديث الدور.");
    }
  };


  const makeUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/user/user/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // تحديث قائمة المستخدمين بعد تغيير الدور
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: "user" } : user
        )
      );
      alert("تم تحويل المستخدم إلى User بنجاح.");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء تحديث الدور.");
    }
        }

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <AdminDropdown/>
        <h1 style={styles.adminTitle}>Admin Dashboard</h1>
      </div>

      {/* Statistics Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <FaChartLine style={styles.sectionIcon} />
          Admin Statistics
        </h3>
        
        {statistics ? (
          <div style={styles.statsGrid}>
            {/* Total Users Card */}
            <div style={styles.statCard}>
              <FaUsers style={styles.statIcon} />
              <div style={styles.statContent}>
                <span style={styles.statLabel}>Total Users</span>
                <span style={styles.statValue}>{statistics.totalUsers}</span>
              </div>
            </div>

            {/* Total Admins Card */}
            <div style={styles.statCard}>
              <FaUserShield style={styles.statIcon} />
              <div style={styles.statContent}>
                <span style={styles.statLabel}>Total Admins</span>
                <span style={styles.statValue}>{statistics.totalAdmins}</span>
              </div>
            </div>

            {/* Users by Role Chart */}
            <div style={styles.chartCard}>
              <h4 style={styles.chartTitle}>
                <FaChartLine style={styles.chartIcon} />
                Users by Role
              </h4>
              <Line 
                data={chartData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      labels: { color: '#fff' }
                    }
                  },
                  scales: {
                    y: { ticks: { color: '#fff' } },
                    x: { ticks: { color: '#fff' } }
                  }
                }}
                style={styles.chart}
              />
            </div>
          </div>
        ) : (
          <div style={styles.loading}>
            <FaChartLine className="fa-spin" />
            Loading Statistics...
          </div>
        )}
      </div>

      {/* Users List Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <FaUsers style={styles.sectionIcon} />
          All Users ({users.length})
        </h2>
        
        <div style={styles.usersGrid}>
          {users.map((user) => (
            <div key={user._id} style={styles.userCard}>
              <div style={styles.userHeader}>
                <span style={styles.userName}>{user.name}</span>
                <span style={{
                  ...styles.userStatus,
                  background: user.isBlocked ? '#e74c3c' : '#2ecc71'
                }}>
                  {user.isBlocked ? 'Blocked' : 'Active'}
                </span>
              </div>
              
              <div style={styles.userDetails}>
                <p style={styles.userEmail}>{user.email}</p>
                <p style={styles.userActivity}>
                  Last Activity: {new Date(user.lastActivity).toLocaleString()}
                </p>
              </div>

              <button 
                onClick={() => toggleUserStatus(user._id, user.isBlocked)}
                style={{
                  ...styles.actionButton,
                  background: user.isBlocked ? '#2ecc71' : '#e74c3c'
                }}
              >
                {user.isBlocked ? (
                  <>
                    <FaUnlockAlt style={styles.buttonIcon} />
                    Unblock
                  </>
                ) : (
                  <>
                    <FaLock style={styles.buttonIcon} />
                    Block
                  </>
                )}
              </button>
            
             
              {user.role !== "admin" && (
            <button onClick={() => makeAdmin(user._id)} style={{
              color: "green",
              background: "none",
              border: "none",
              cursor: "pointer",
              marginLeft: "10px",
              marginTop: "20px"
             }}>
               <FaUserShield size={30} style={styles.buttonIcon}/>
            </button>

          )}

          {user.role === "admin" && (
            <button onClick={() => makeUser(user._id)} style={{
              color: "red",
              background: "none",
              border: "none",
              cursor: "pointer",
              marginLeft: "10px",
              marginTop: "20px"
                   
             }}>
               <FaUser size={30} style={styles.buttonIcon}/>
            </button>
            )}
            </div>
            
          ))}
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    padding: '2rem',
    background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
    minHeight: '100vh',
    color: '#fff',
    fontFamily: "'Inter', sans-serif"
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '2px solid rgba(255,255,255,0.1)'
  },
  acceptButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '0.8rem 1.5rem',
    background: 'linear-gradient(45deg, #00f3ff, #2ecc71)',
    borderRadius: '30px',
    color: '#fff',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 5px 15px rgba(0,243,255,0.3)'
    }
  },
  adminTitle: {
    fontSize: '2.5rem',
    background: 'linear-gradient(45deg, #00f3ff, #2ecc71)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0
  },
  section: {
    marginBottom: '3rem',
    padding: '1.5rem',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '15px',
    backdropFilter: 'blur(10px)'
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    color: '#00f3ff'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '1.5rem',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '15px',
    border: '1px solid rgba(0,243,255,0.2)'
  },
  statIcon: {
    fontSize: '2.5rem',
    color: '#00f3ff'
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  statLabel: {
    color: '#b2bec3',
    fontSize: '0.9rem'
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#fff'
  },
  chartCard: {
    padding: '1.5rem',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '15px',
    gridColumn: '1 / -1'
  },
  usersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  userCard: {
    padding: '1.5rem',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '15px',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  userHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  userName: {
    fontSize: '1.2rem',
    fontWeight: '600'
  },
  userStatus: {
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.9rem'
  },
  userDetails: {
    marginBottom: '1.5rem'
  },
  userEmail: {
    color: '#b2bec3',
    margin: '0.5rem 0'
  },
  userActivity: {
    color: '#94a3b8',
    fontSize: '0.9rem',
    margin: 0
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    width: '100%',
    padding: '0.8rem',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      opacity: '0.9',
      transform: 'translateY(-2px)'
    }
  },
  buttonIcon: {
    fontSize: '1.2rem'
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: '2rem',
    color: '#b2bec3'
  }
};

export default AdminDashbord;