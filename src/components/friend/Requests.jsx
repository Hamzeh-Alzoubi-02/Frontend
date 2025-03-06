import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { FiX, FiCheck } from "react-icons/fi";
import defaultProfile from "../../assets/img/c0749b7cc401421662ae901ec8f9f660.jpg";

export function Requests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRequests = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/friend-requests", {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Friend Requests Data:", res.data);
            setRequests(res.data.friendRequests); 
        } catch (err) {
            setError("Failed to fetch friend requests");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleAction = async (requestId, action) => {
        try {
            const token = localStorage.getItem("token");
            const url = `http://localhost:5000/api/${action}-friend-request/${requestId}`;

            console.log(`Sending request to: ${url}`);
            
            await axios.post(url, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setRequests(prevRequests => prevRequests.filter(request => request.userId !== requestId));
        } catch (err) {
            console.error(`Failed to ${action} request`, err);
            setError(`Failed to ${action} friend request`);
        }
    };

    const acceptRequest = (requestId) => handleAction(requestId, "accept");
    const rejectRequest = (requestId) => handleAction(requestId, "reject");

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="requests-container">
            <div className="requests-card">
                <div className="header">
                    <h1>Friend Requests</h1>
                    <div className="line"></div>
                </div>

                {requests.length === 0 ? (
                    <div className="no-requests">
                        <p>No friend requests</p>
                    </div>
                ) : (
                    <div className="requests-list">
                        {requests.map(({ userId, friend }) => (
                            <div key={userId} className="request-card">
                                <div className="user-info">
                                    <div className="profile-img">
                                        <img
                                            src={friend?.profileImage ? `http://localhost:5000${friend.profileImage}` : defaultProfile}
                                            alt="Profile"
                                            onError={(e) => (e.target.src = defaultProfile)}
                                        />
                                    </div>
                                    <div className="details">
                                        <h3>{friend?.name || 'Unknown User'}</h3>
                                        <p>{friend?.email || 'No email available'}</p>
                                    </div>
                                </div>

                                <div className="action-buttons">
                                    <button onClick={() => rejectRequest(userId)} className="reject">
                                        <FiX size={18} /> Reject
                                    </button>
                                    <button onClick={() => acceptRequest(userId)} className="accept">
                                        <FiCheck size={18} /> Accept
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
