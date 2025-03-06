import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiTrash2, FiCheckCircle, FiXCircle, FiAlertCircle,FiImage } from 'react-icons/fi';

const AdminReviewProject = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/get-project", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log(response.data);

        if (Array.isArray(response.data)) {
          setProjects(response.data);
        } else {
          setError("The fetched data is not an array.");
        }
      } catch (err) {
        setError("Failed to fetch projects.");
      }
    };

    fetchProjects();
  }, []);

  const handleApprove = async (projectId) => {
    try {
      const response = await axios.patch( 
        `http://localhost:5000/api/admin/projects/${projectId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setProjects((prevProjects) =>
          prevProjects.map((proj) =>
            proj._id === projectId ? { ...proj, statusProject: "approved" } : proj
          )
        );
      }
    } catch (err) {
      setError("Failed to approve project.");
    }
  };

  const handleReject = async (projectId) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/admin/projects/${projectId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setProjects((prevProjects) =>
          prevProjects.map((proj) =>
            proj._id === projectId ? { ...proj, statusProject: "rejected" } : proj
          )
        );
      }
    } catch (err) {
      setError("Failed to reject project.");
    }
  };

 
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: "'Poppins', sans-serif",
      background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
      minHeight: '100vh',
      color: '#fff',
      position: 'relative'
    }}>
      {/* Delete Comment Button */}
      <Link to='/DeleteCommentProject' style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        textDecoration: 'none'
      }}>
        <button style={{
    background: 'linear-gradient(45deg, #00f3ff, #2ecc71)',
    color: 'white',
          padding: '12px 25px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 15px rgba(255, 77, 77, 0.3)',
          transition: 'all 0.3s ease'
        }}>
          <FiTrash2 size={18} />
          Delete Comment
        </button>
      </Link>
  
      {/* Main Content */}
      <h3 style={{
        color: '#00f3ff',
        fontSize: '2rem',
        marginBottom: '2rem',
        textAlign: 'center',
        textShadow: '0 0 10px rgba(0, 243, 255, 0.5)'
      }}>
        Pending Projects
      </h3>
  
      {error && (
        <div style={{
          background: 'rgba(255, 77, 77, 0.1)',
          border: '2px solid #ff4d4d',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <FiAlertCircle color="#ff4d4d" size={24} />
          <span style={{ color: '#ff4d4d' }}>{error}</span>
        </div>
      )}
  
      {projects.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px'
        }}>
          <p style={{
            color: '#666',
            fontSize: '1.2rem',
            margin: 0
          }}>
            🎉 No projects pending review!
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {projects.map((proj) => (
            <article key={proj._id} style={{
              background: 'rgba(255, 255, 255, 0.05)',              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease',
              position: 'relative',
              border: '2px solid transparent',
              ':hover': {
                transform: 'translateY(-5px)',
                borderColor: '#00f3ff',
                boxShadow: '0 8px 20px rgba(0, 243, 255, 0.2)'
              }
            }}>
              {/* Project Image */}
              {Array.isArray(proj.images) && proj.images.length > 0 ? (
                <div style={{
                  position: 'relative',
                  marginBottom: '1rem'
                }}>
                  <img
                    src={`http://localhost:5000/uploads/${proj.images[0]}`}
                    alt={proj.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '2px solid #00f3ff'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <FiImage color="#00f3ff" size={16} />
                    <span style={{ fontSize: '0.8rem' }}>{proj.images.length}</span>
                  </div>
                </div>
              ) : (
                <div style={{
                  height: '200px',
                  background: '#2a2a4a',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FiImage size={40} color="#666" />
                </div>
              )}
  
              {/* Project Title */}
              <h4 style={{
                color: '#fff',
                fontSize: '1.25rem',
                marginBottom: '0.5rem'
              }}>
                {proj.title}
              </h4>
  
              {/* Status Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: proj.statusProject === 'pending' 
                  ? 'rgba(0,243,255,0.1)' 
                  : proj.statusProject === 'approved' 
                  ? 'rgba(0, 255, 0, 0)' 
                  : 'rgba(255, 0, 0, 0)',
                padding: '6px 12px',
                borderRadius: '20px',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: proj.statusProject === 'pending' 
                    ? 'rgba(0,243,255,0.1)' 
                    : proj.statusProject === 'approved' 
                    ? '#00ff01' 
                    : '#ff0000'
                }} />
                                  

                <span style={{
                  color: proj.statusProject === 'pending' 
                    ? '#00f3ff' 
                    : proj.statusProject === 'approved' 
                    ? '#00ff10' 
                    : '#ff0000',
                  fontSize: '0.9rem'
                }}>
                  {proj.statusProject ?? 'Unknown'}
                </span>
              </div>
  
              {/* Action Buttons */}
              {proj.statusProject === 'pending' && (
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  marginTop: '1rem'
                }}>
                  <button
                    onClick={() => handleApprove(proj._id)}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(45deg,rgba(0, 204, 0, 0.49),rgba(0, 153, 0, 0.37))',
                      color: 'white',
                      padding: '12px',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <FiCheckCircle size={20} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(proj._id)}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(45deg,rgba(255, 51, 51, 0.42),rgba(204, 0, 0, 0.37))',
                      color: 'white',
                      padding: '12px',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <FiXCircle size={20} />
                    Reject
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviewProject;
