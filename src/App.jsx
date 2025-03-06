import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './auth/Login';
import SignUp from './auth/SignUp';
import Profile from './pages/Profile';
import UsersList from './pages/UserList';
import UserDetails from './pages/UserDetails';
import { Requests } from './components/friend/Requests';
import CreatePost from './pages/CreatePost';
import GetFrindes from './components/friend/GetFriends';
import ViewProfile from './pages/ViewProfile';
import ViewPost from './pages/ViewPost';
import UploadProject from './components/Project/UploadProject';
import GetProject from './components/Project/GetProject';
import Home from './pages/Home';
import SettingsEdit from './components/SettingsEdit';
import EditPost from './components/EditPost';
import EditProject from './components/EditProject';
import AdminDashbord from './Admin/Pages/AdminDashbord';
import AdminReviewPosts from './Admin/Pages/AdminReviewPosts';
import AdminReviewProject from './Admin/Pages/AdminReviewProject';
import DeleteCommentProject from './Admin/Component/DeleteCommentProject';
import DeleteCommentPost from './Admin/Component/DeleteCommentPost';
import Notifications from './pages/Notifications';
import SendNotification from './Admin/Component/SendNotification';

function App() {
   
  

  return (
    <div>
    
       

      <Routes>
        <Route path="/sentNotification" element={<SendNotification />} />
        <Route path="/notification" element={<Notifications />} />
        <Route path="/DeleteCommentPost" element={<DeleteCommentPost />} />
        <Route path="/DeleteCommentProject" element={<DeleteCommentProject />} />
        <Route path="/AccpetProject" element={<AdminReviewProject />} />
        <Route path="/AcceptPost" element={<AdminReviewPosts />} />
        <Route path="/admindash" element={<AdminDashbord />} />



<Route path="/upload-project" element={<UploadProject />} />
<Route path="/GetProject" element={<GetProject />} />
       <Route path="/view-psot" element={<ViewPost />} />
       <Route path="/edit-posts/:userId" element={<EditPost />} />
       <Route path="/edit-project" element={<EditProject />} />

          <Route path="/settings" element={<SettingsEdit />} />
          <Route path="/home" element={<Home />} />
        <Route path="/Friends" element={<GetFrindes />} />
        <Route path="/view-profile" element={<ViewProfile />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/request" element={<Requests />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/:id" element={<UserDetails />} />
        <Route path="/friends/users/:id" element={<UserDetails />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
