import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
 // تأكد من إنشاء هذا الملف للأنماط




 const renderStars = (rating) => {
    const fullStars = Math.floor(rating); // النجوم الممتلئة
    const halfStar = rating % 1 >= 0.5 ? 1 : 0; // إذا كان التقييم يحتوي على نصف نجمة
    const emptyStars = 5 - fullStars - halfStar; // النجوم الفارغة

    return (
      <div className="stars">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="star filled">★</span>
        ))}
        {halfStar === 1 && (
          <span className="star half">☆</span> // نصف نجمة
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="star">☆</span>
        ))}
      </div>
    );
};






export default function GetFriends() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/get-friends', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
             
            setFriends(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    fetchFriends();
  }, []);


  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) return 0;
    const totalRating = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return totalRating / ratings.length;
  };

  return (
    <div className="App-Get-friends"> 
      <div className="friends-container-Get-friends">
        <div className="friends-cont-Get-friends">
          <h1 className="friends-container-Get-friends-title">Friends List</h1>
  
          {friends.length > 0 ? (
            <div className="friends-container-Get-friends">
              {friends.map((friend) => {
                const averageRating = calculateAverageRating(friend.ratings);
  
                return (
                  <div key={friend._id} className="friends-container-Get-friends-item">
                    <div className="friends-container-Get-friends-item-overlay"></div>
  
                    <div className="friends-container-Get-friends-item-content">
                      <img
                        className="friends-container-Get-friends-item-content-img"
                        src={`http://localhost:5000${friend.profileImage}`}
                        alt={friend.name}
                      />
  
                      <Link 
                        className="friends-container-Get-friends-item-content-name"
                        to={`/users/${friend._id}`}
                      >
                        {friend.name}
                        <span className="friends-container-Get-friends-item-content-name-line"></span>
                      </Link>
  
                      <div className="friends-container-Get-friends-item-content-location">
                        <i className="fas fa-map-marker-alt" id="location-icon"></i>
                        <span className="friends-container-Get-friends-item-content-location-text">
                          {friend.personalInfo?.country || 'Unknown location'}
                        </span>
                      </div>
  
                      {/* Stats Section */}
                      <div className="friends-container-Get-friends-item-content-stats">
                        <div className="friends-container-Get-friends-item-content-stats-item">
                          <i className="fas fa-graduation-cap" id="education-icon"></i>
                          <span className="friends-container-Get-friends-item-content-stats-item-text">
                            {friend.GeneralInfo?.Education || 'No education info'}
                          </span>
                        </div>
  
                        <div className="friends-container-Get-friends-item-content-stats-item">
                          <i className="fas fa-briefcase" id="work-icon"></i>
                          <span className="friends-container-Get-friends-item-content-stats-item-text">
                            {friend.personalInfo?.occupation || 'No occupation'}
                          </span>
                        </div>
  
                        <div className="friends-container-Get-friends-item-content-stats-item-line">
                          <i className="fas fa-star" id="star-icon"></i>
                          <div className="friends-container-Get-friends-item-content-stats-item-line-stars">
                            {renderStars(averageRating)}
                          </div>
                          <span className="friends-container-Get-friends-item-content-stats-item-line-text">
                            ({averageRating.toFixed(1)})
                          </span>
                        </div>
                      </div>
  
                      <button className="friends-container-Get-friends-item-content-button">
                        <i className="fas fa-comment-dots"></i>
                        Send Message 
                        (Soon)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="friends-container-Get-friends-empty">
              <i className="fas fa-user-friends" id="empty-icon"></i>
              <p>No friends found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 