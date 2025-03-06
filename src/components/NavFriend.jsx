import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import defaultProfile from "../assets/img/c0749b7cc401421662ae901ec8f9f660.jpg";

export default function NavFriend() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFriends = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/get-friends", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriends(response.data);
    } catch (err) {
      setError("Failed to fetch friends. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  return (
    <div className="nav-friend"> 
    <div className="nav-friends">
      <div className="friends-container">
        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : error ? (
          <div>
            <p className="error-text">{error}</p>
            <button onClick={fetchFriends} className="retry-button">
              Retry
            </button>
          </div>
        ) : friends.length === 0 ? (
          <p className="no-friends">No friends yet.</p>
        ) : (
          <div>
            {friends.map((friend) => (
              <Link key={friend._id} to={`/users/${friend._id}`} className="friend-item">
                <img
                  src={friend.profileImage ? `http://localhost:5000${friend.profileImage}` : defaultProfile}
                  alt={friend.name || "Friend"}
                  onError={(e) => (e.target.src = defaultProfile)}
                  className="friend-avatar"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
