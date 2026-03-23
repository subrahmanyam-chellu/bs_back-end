import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CircularIndeterminate from '../componets/CircularIndeterminate';
import Avatar from '@mui/material/Avatar';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormLabel from '@mui/material/FormLabel';


const Forms = ({ isLogin, setIsLogin, isRegister, setIsRegister }) => {

    const [profile, setProfile] = useState();
    const [profileUrl, setProfileUrl] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('');
    const [penName, setPenName] = useState(null);
    const [error, setError] = useState('');
    const [errorL, setErrorL] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const toggleLogin = () => {
        setIsLogin(true);
        setIsRegister(false);
    }

    const toggleRegister = () => {
        setIsLogin(false);
        setIsRegister(true);
    }

    const validate = () => {
        if (name.length < 3) {
            setError("Name must contain atleast 3 characters");
        }
        else if (phoneNumber.length < 10) {
            setError("phone number should be 10 digits");
        }
        else if (!password.match(passwordRegex)) {
            setError("Password must contain atleast 8 characters, 1-UpperCase, LowerCase, Numerical, Symbol");
        }
        else if (password != repassword) {
            setError("both password should be same");
        }
        else if ((password == repassword)) {
            setError("");
        }

    }

    const handleRegister = async (e) => {
        e.preventDefault();
        if(role=='user'){
            setPenName(null);
        }
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/sign-up/`, { profileUrl, name, email, phoneNumber, role, password, penName });
            if (response.status === 200) {
                alert("Registered successfully.");
                setLoading(false);
                navigate('/auth');
            }
        } catch (err) {
            if (err.response.status == 409) {
                setError(err.response.data.message);
                setLoading(false);
            } else {
                setError("Registration failed. Please try again.");
                setLoading(false);
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login/`, { email, password });
            if (response.status === 200) {
                localStorage.setItem("x-token", response.data.token.token);
                setLoading(false);
                navigate('/latestblogspage');
            }
        } catch (err) {
            setErrorL("Login failed. Please check your credentials.");
            setLoading(false);
        }
    };

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

    useEffect(() => { validate(); }, [name, email, phoneNumber, password, repassword]);

    return (
        <>
            {loading && <CircularIndeterminate texts='Loading...' />}
            <Box sx={{ justifySelf: 'center', border: '2px solid black', borderRadius: '15px', p: 2, justifyContent: 'center', '&:hover': { boxShadow: '2px 2px 5px 5px grey', transform: 'translateY(-5px)' }, my: { xs: '30px' }, minHeight:'100vh' }}>
                <Box sx={{ width: '95%', display: 'flex', justifyContent: 'space-between', my: 3, p: 0.5, border: '2px solid black', borderRadius: '15px' }}>
                    <Button
                        variant={isRegister ? "contained" : "outlined"}
                        onClick={() => { toggleRegister(); validate(); }}
                        sx={{
                            flex: 1,
                            border: '0px',
                            background: isRegister
                                ? "linear-gradient(to right, rgba(230, 0, 255, 0.899), rgba(0, 221, 255, 0.765))"
                                : "none", borderRadius: '10px',
                            '&:focus': { outline: 'none' }
                        }}
                    >
                        Signup
                    </Button>
                    <Button
                        variant={isLogin ? "contained" : "outlined"}
                        onClick={() => { toggleLogin(); setError("") }}
                        sx={{
                            flex: 1,
                            border: '0px',
                            background: isLogin
                                ? "linear-gradient(to right, rgba(230, 0, 255, 0.899), rgba(0, 221, 255, 0.765))"
                                : "none", borderRadius: '10px',
                            '&:focus': { outline: 'none' }
                        }}
                    >
                        Login
                    </Button>
                </Box>


                {/* Forms */}
                {isRegister && (
                    <Box component="form" onSubmit={handleRegister} sx={{ mt: 3, borderRadius: '15px'}}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, my: 2 }}>
                            <Avatar src={profile} alt='profile' sx={{ width: '100px', height: '100px', m: 'auto' }} />
                            <input accept='image/*' type='file' id='profile-pic' onChange={handleFileChange} style={{ display: 'none' }} />
                            <label htmlFor="profile-pic">
                                <Button variant="contained" component="span" sx={{ textTransform: 'none', m: 'auto', borderRadius: 6 }}>
                                    Upload profile
                                </Button>
                            </label>
                        </Box>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={name}
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
                            type="text"
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
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            required
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Re-enter Password"
                            name="repassword"
                            type="password"
                            value={repassword}
                            onChange={(e) => { setRepassword(e.target.value) }}
                            required
                            sx={{ mb: 3 }}
                        />
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
                        <Button type="submit" fullWidth variant="contained" color='success' sx={{ textTransform: 'none', fontSize: 18, fontWeight: 500, borderRadius: '10px' }} onClick={(e) => { handleRegister(e); }}>Register</Button>
                    </Box>
                )}

                {isLogin && (
                    <Box component="form" onSubmit={handleLogin} sx={{ mt: 3, borderRadius: '15px' }}>
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
                            label="Password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            required
                            sx={{ mb: 3 }}
                        />
                        {
                            error &&
                            <Typography color='error' sx={{ textAlign: 'center', textTransform: 'none', my: '8px' }}>{errorL}</Typography>
                        }
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button type="button" variant="text" sx={{ textTransform: 'none', fontSize: 12, fontWeight: 500 }}>Forgot Password</Button>
                            <Button type="submit" variant="contained" color='success' sx={{ textTransform: 'none', fontSize: 18, fontWeight: 500, borderRadius: '10px' }} onClick={(e) => { handleLogin(e); }}>Login</Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </>
    )
}

export default Forms
