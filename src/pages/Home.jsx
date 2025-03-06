import NavHome from "../components/navbar/NavHome";
import NavFriend from "../components/NavFriend";
import GetProjects from "../components/Project/GetProject";
import HomeCreatePost from "./HomeCreatePost";

export default function Home() {
  return (
    <div className="home-container">
      <NavHome />

      <div className="main-content">
        {/* Left Section */}
        <div className="left-section">
          {/* يمكن إضافة محتوى هنا في المستقبل */}
        </div>

        <div className="main-section">
          <HomeCreatePost />
          <GetProjects />
        </div>

        {/* Right Section - NavFriend as Sidebar */}
        <div className="right-section">
          <div className="sidebar">
            <NavFriend />
          </div>
        </div>
      </div>
    </div>
  );
}
