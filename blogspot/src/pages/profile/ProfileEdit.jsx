import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/mainlayout/MainLayout';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ProfileEdit = () => {

    const location = useLocation();
    const { user } = location.state || {};
    const navigate = useNavigate();

    const [profile, setProfile] = useState(user.profileUrl);
    const [profileUrl, setProfileUrl] = useState(user.profileUrl);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
    const [role, setRole] = useState(user.role);
    const [penName, setPenName] = useState(user.penName);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState('');
    const token = localStorage.getItem("x-token");

    useEffect(()=>{
        if(token){
            const decode = jwtDecode(token);
            if(decode.exp*1000>Date.now()){
               setUserId(decode.userId);
            }
        }else{
            navigate('/auth');
        }
    },[]);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert("File is too large. Max size is 2MB.");
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        setProfile(previewUrl);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
        formData.append("folder", import.meta.env.VITE_FOLDER);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
                formData
            );
            setProfileUrl(response.data.secure_url);
            console.log("Uploaded URL:", response.data.secure_url);
        } catch (error) {
            alert(`Upload failed: ${error.response?.data?.error?.message || error.message}`);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (role === 'user') {
            setPenName('');
        }
        setLoading(true);
        try {
            console.log(userId, profileUrl, name, email, phoneNumber, role, user.password, penName);
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/updateuser/${userId}`,{ profileUrl, name, email, phoneNumber, role, password: user.password, penName },
                { headers: { Authorization: `Bearer ${token}` } } );
            if (response.status === 200) {
                alert("Registered successfully.");
                setLoading(false);
                navigate(-1);
            }
        } catch (err) {
            setError(`Updation failed: ${err.response?.data?.message || err.message}`);
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <Box component="form" onSubmit={handleUpdate} sx={{ mt: 3, borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '95vw', sm: '410px' } }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, my: 2 }}>
                        <Avatar src={profile} alt='profile' sx={{ width: '100px', height: '100px', m: 'auto' }} />
                        <input accept='image/*' type='file' id='profile-pic' onChange={handleFileChange} style={{ display: 'none' }} />
                        <label htmlFor="profile-pic">
                            <Button variant="contained" component="span" sx={{ textTransform: 'none', m: 'auto', borderRadius: 6 }}>
                                Upload profile
                            </Button>
                        </label>
                        <Typography sx={{ fontSize: '10px' }}>Note: only profile can be updated using upload profile</Typography>
                    </Box>
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={name}
                        pattern="^.{3,}$"
                        onChange={(e) => { setName(e.target.value) }}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        type="String"
                        value={phoneNumber}
                        pattern="[0-9]{10}"
                        onChange={(e) => { setPhoneNumber(e.target.value) }}
                        required
                        sx={{ mb: 2 }}
                    />
                    <FormLabel>Select Role</FormLabel>
                    <RadioGroup
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        row
                    >
                        <FormControlLabel value="user" control={<Radio />} label="User" />
                        <FormControlLabel value="author" control={<Radio />} label="Author" />
                    </RadioGroup>
                    {
                        (role == 'author') &&
                        <TextField
                            fullWidth
                            label="PenName"
                            name="penname"
                            type="text"
                            value={penName}
                            onChange={(e) => { setPenName(e.target.value) }}
                            required
                            sx={{ mb: 3 }}
                        />
                    }
                    {
                        error &&
                        <Typography color='error' sx={{ textAlign: 'center', textTransform: 'none', my: '8px' }}>{error}</Typography>
                    }
                    <Button type="submit" fullWidth variant="contained" color='success' sx={{ textTransform: 'none', fontSize: 18, fontWeight: 500, borderRadius: '10px' }} onClick={(e) => { handleUpdate(e); }}>update</Button>
                </Box>
            </Box>
        </MainLayout>
    )
}

export default ProfileEdit
