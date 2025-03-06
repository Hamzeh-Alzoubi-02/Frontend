import axios from "axios";
import { useEffect, useState } from "react";

export default function DeleteCommentProject() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/admin/projects", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProjects(response.data);
            } catch (err) {
                setError("An error occurred while fetching projects. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const deleteComment = async (commentId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.patch(`http://localhost:5000/api/admin/delete-comment-project/${commentId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setProjects((prevProjects) =>
                prevProjects.map((project) => ({
                    ...project,
                    comments: project.comments.filter((comment) => comment._id !== commentId),
                }))
            );
        } catch (err) {
            console.error("Error deleting comment:", err);
            alert("An error occurred while deleting the comment.");
        }
    };

    return (
        <div style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "2rem",
            fontFamily: "'Tajawal', sans-serif",
            background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
            minHeight: "100vh",
            color: "#fff"
        }}>
            <h1 style={{
                textAlign: "center",
                fontSize: "2.5rem",
                marginBottom: "2rem",
                color: '#00f3ff',
                textShadow: "0 0 15px rgba(0, 0, 0, 0.5)"
            }}>
                Projects Comments
            </h1>

            {loading && (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "2rem"
                }}>
                    <div className="spinner" style={{
                        width: "40px",
                        height: "40px",
                        border: "4px solid rgb(0, 0, 0)",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                    }} />
                    <p style={{ fontSize: "1.2rem" }}>Loading projects...</p>
                </div>
            )}

            {error && (
                <div style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "2px solid #ef4444",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    marginBottom: "2rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem"
                }}>
                    <span style={{ color: "#ef4444", fontSize: "1.5rem" }}>⚠️</span>
                    <p style={{ color: "#ef4444", margin: 0 }}>{error}</p>
                </div>
            )}

            {!loading && !error && projects.length === 0 && (
                <div style={{
                    textAlign: "center",
                    padding: "4rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "16px"
                }}>
                    <p style={{
                        color: "#64748b",
                        fontSize: "1.2rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem"
                    }}>
                        <span>📭</span>
                        No projects available at the moment
                    </p>
                </div>
            )}

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: "1.5rem"
            }}>
                {!loading && !error && projects.map((project) => (
                    <div
                        key={project._id}
                        style={{
                            background: 'rgba(255,255,255,0.08)',
                            borderRadius: "16px",
                            padding: "1.5rem",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        <h2 style={{
                           color: '#b2bec3',
                            fontSize: "1.5rem",
                            marginBottom: "1rem",
                        }}>
                            <span>📁</span>
                            {project.title}
                        </h2>

                        <p style={{
                            color: "#94a3b8",
                            lineHeight: "1.6",
                            marginBottom: "1.5rem"
                        }}>
                            {project.description}
                        </p>

                        <div style={{ borderTop: "2px solid #334155", paddingTop: "1.5rem" }}>
                            <h3 style={{ color: "#334155", fontSize: "1.2rem", marginBottom: "1rem" }}>
                                <span>💬</span>
                                Comments:
                            </h3>

                            {project.comments && project.comments.length > 0 ? (
                                project.comments.map((comment) => (
                                    <div key={comment._id} style={{ background: "#334155", padding: "1rem", position: "relative" }}>
                                        <strong style={{ color: "#e2e8f0" }}>
                                            {comment.userId?.name || "Unknown User"}
                                        </strong>
                                        <p style={{ color: "#cbd5e1", margin: "0 0 1rem 0" }}>{comment.text}</p>
                                        <button onClick={() => deleteComment(comment._id)} style={{ background: "rgba(239, 68, 68, 0.2)", color: "#ef4444", border: "none", padding: "0.5rem", borderRadius: "6px", cursor: "pointer" }}>Delete</button>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: "#64748b", textAlign: "center", padding: "1rem" }}>No comments yet</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
