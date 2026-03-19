import { createContext, useEffect, useState } from 'react'
import './App.css'
import LandingPage from './pages/landingpage/LandingPage';
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import Auth from './pages/auth/Auth';
import { jwtDecode } from 'jwt-decode';
import LatestBlogs from './pages/latestblogspage/LatestBlogs';
import Post from './pages/post/Post';
import EditPage from './pages/editpage/EditPage';
import CreateBlog from './pages/createblog/CreateBlog';
import axios from 'axios';
import EditPost from './pages/editpost/EditPost';
import MyBlogs from './pages/myblogs/MyBlogs';
import DeletePage from './pages/deletepage/DeletePage';
import DraftsPage from './pages/drafts/DraftsPage';
import Profile from './pages/profile/Profile';
import ProfileEdit from './pages/profile/ProfileEdit';

export const UserContext = createContext();
function App() {

  const [user, setUser] = useState({});
  const token = localStorage.getItem('x-token');
  const [error, setError] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decode = jwtDecode(token);
      if (decode.exp * 1000 > Date.now()) {
        handleUserDetails(decode.userId);
      }
    } else {
      localStorage.removeItem("x-token");
      navigate('/auth');
    }
  }, []);

  const handleUserDetails = async (userId) => {
    try {
      const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getuser/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (result.status === 200) {
        setUser(result.data.user);
      }

    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 500) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/auth' element={<Auth />} />
          <Route path='/latestblogspage' element={<LatestBlogs />} />
          <Route path='/latestblogspage/post' element={<Post />} />
          <Route path='/create' element={<CreateBlog />} />
          <Route path='/editpage' element={<EditPage />} />
          <Route path='/editpage/editpost' element={<EditPost/>} />
          <Route path='/myblogspage' element={<MyBlogs/>} />
          <Route path='/myblogspage/editpost' element={<EditPost/>} />
          <Route path='/deletepage' element={<DeletePage/>} />
          <Route path='/draftspage' element={<DraftsPage/>} />
          <Route path='/profile' element={<Profile/>}/>
          {/* <Route path='/profile/edit' element={<ProfileEdit/>}/> */}
        </Routes>
    </UserContext.Provider> 
  )
}

export default App
