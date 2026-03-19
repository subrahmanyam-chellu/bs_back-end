import React, { useEffect, useState } from 'react';
import MainLayout from '../../layouts/mainlayout/MainLayout';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Post = () => {
  const [post, setPost] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const { postData } = location.state || {};
  const token = localStorage.getItem("x-token");

  useEffect(() => {
    if (postData) setPost(postData);
  }, [postData]);

  const getLatestBlogs = async () => {
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/getallposts?postId=${postData._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (result.status === 200) {
        setPost(result.data.posts[0]);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("x-token");
        navigate('/auth');
      }
    }
  };

  return (
    <MainLayout>
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100vw', gap: 2, my:{xs:'10px', sm:'25px'} }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h4" sx={{textAlign:'center'}}>{post.title}</Typography>
          <Box component="img" src={post.image} alt={post.title} sx={{ maxWidth: '100%', my: 2 }} />
          <Typography sx={{textAlign:'center'}}>{post.content}</Typography>
          <Typography variant='h6' sx={{ mt: 2 }}>Author:<span style={{fontSize:20}}> {post.penName}</span></Typography>
          <Button variant='contained' sx={{ mt: 2, borderRadius:2 }} onClick={() => navigate(-1)}>Back</Button>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default Post;