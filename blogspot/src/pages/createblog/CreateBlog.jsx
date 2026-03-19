import React, { useEffect, useState } from 'react'
import MainLayout from '../../layouts/mainlayout/MainLayout';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../App';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const CreatePost = () => {

    const [image, setImage] = useState();
    const [imageUrl, setImageUrl] = useState();
    const [title, setTitle] = useState();
    const [content, setContent] = useState();
    const [penName, setPenName] = useState();
    const { user } = useContext(UserContext);
    const [authorId, setAuthorId] = useState();
    const [error, setError] = useState();
    const navigate = useNavigate();
    const token = localStorage.getItem("x-token");


    useEffect(() => {
        userRole();
        setAuthorId(user._id);
        setPenName(user.penName);
    }, [user]);


    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert("File is too large. Max size is 2MB.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
        formData.append("folder", import.meta.env.VITE_FOLDER);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
                formData
            );
            setImageUrl(response.data.secure_url);
            const previewUrl = URL.createObjectURL(file);
            setImage(previewUrl);
            console.log("Uploaded URL:", response.data.secure_url);
        } catch (error) {
            alert(`Upload failed: ${error.response?.data?.error?.message || error.message}`);
        }
    };

    const handleSumbit = async () => {
        try {
            const result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/createpost/`, { title, image: imageUrl, content, penName, authorId, status: 'draft' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (result.status === 200) {
                navigate('/latestblogspage');
            }

        } catch (error) {
            setError(error.response.data.message);
        }

    };

    const userRole = () => {
        if (token) {
            const decode = jwtDecode(token);
            if (decode.exp * 1000 > Date.now()) {
                if (decode.userRole.toLowerCase() === 'admin') {
                    setAuthorId(decode.userId);
                    setPenName("admin")
                }
                else if (decode.userRole.toLowerCase() === 'author') {
                    setAuthorId(decode.userId);
                }
                else {
                    navigate('/latestblogs');
                }
            }
        }
        else {
            setRole('null');
            localStorage.removeItem("x-token");
            navigate('/auth');
        }
    };



    return (
        <MainLayout>
            <Box sx={{display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:'100vh', width:{xs:'100vw', sm:'99vw'}}}>
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100vw' }}>
                    <Box sx={{ minWidth: { xs: '95vw', sm: '410px' }, display: 'flex', flexDirection: 'column', gap: 2, alignContent: 'center', m: { xs: '10px', sm: '25px' }, backgroundColor: '#f4f4f4', '&:focus': { boxShadow: '2px 2px 2px 3px rgb(92, 90, 92)' }, p: 3, justifyContent: 'center', borderRadius: 2 }}>
                        <Box component='img' src={image} alt='image' width='100%' height='200px' style={{ borderRadius: '10px' }} />
                        <input accept='image/*' type='file' id='blog-image' onChange={handleFileChange} style={{ display: 'none' }} />
                        <label htmlFor="blog-image">
                            <Button variant="contained" component="span" sx={{ textTransform: 'none', m: 'auto', borderRadius: 6 }}>
                                Upload picture
                            </Button>
                        </label>
                        <TextField
                            fullWidth
                            label="Title"
                            name="title"
                            value={title}
                            onChange={(e) => { setTitle(e.target.value) }}
                            required
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Content"
                            name="content"
                            value={content}
                            onChange={(e) => { setContent(e.target.value) }}
                            required
                            sx={{ mb: 2 }}
                        />
                        <Button type="submit" fullWidth variant="contained" color='success' sx={{ textTransform: 'none', fontSize: 18, fontWeight: 500, borderRadius: '10px' }} onClick={() => { handleSumbit(); }}>post</Button>
                    </Box>
                </Box>
            </Box>
        </MainLayout>
    )
}

export default CreatePost
