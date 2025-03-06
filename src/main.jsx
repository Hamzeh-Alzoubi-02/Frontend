import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
 
import App from './App.jsx'
/* Styles */
 
import './style/Signup.css'
import './style/Profile.css'
import './style/ViewProfile.css'
import './style/GetFriends.css'
import './style/UserList.css'
import './style/ViewPost.css'
import './style/UserDetails.css'
import './style/GetProject.css'
import './style/Modal.css'
import './style/CreatePost.css'
import './style/UploadProject.css'
import './style/Notifications.css'
import './style/Requests.css'
import './style/NavFriend.css'
import './style/HomeCreatePost.css'
import './style/NavHome.css'
import './style/Home.css'
import './style/FriendsList.css'
import './style/Settings.css'
import './style/EditPost.css'
import './style/EditProject.css'
 
import { BrowserRouter } from 'react-router-dom'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <App />
</BrowserRouter>
)
