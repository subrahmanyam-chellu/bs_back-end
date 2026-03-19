import React, { useEffect, useState } from 'react'
import MainLayout from '../../layouts/mainlayout/MainLayout'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import MediaCard from '../../componets/MediaCard';
import { jwtDecode } from 'jwt-decode';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Grid from '@mui/material/Grid';
import CircularIndeterminate from '../../componets/CircularIndeterminate';
import CircularIndeterminate2 from '../../componets/CircularIndeterminate2';

const MyBlogs = () => {
    const [latestBlogs, setLatestBlogs] = useState([]);
    const [role, setRole] = useState('');
    const [userId, setUserId] = useState('');
    const [totalPosts, setTotalPosts] = useState();
    const [pageNo, setPageNo] = useState(1);
    const [sort, setSort] = useState('asc');
    const [content, setContent] = useState('');
    const [pageCount, setPageCount] = useState();
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("x-token");
    const navigate = useNavigate();

    useEffect(() => {
        userRole();
        getLatestBlogs();
    }, [pageNo]);

    const userRole = () => {
        if (token) {
            const decode = jwtDecode(token);
            if (decode.exp * 1000 > Date.now()) {
                if (decode.userRole.toLowerCase() === 'admin') {
                    setRole("admin");
                    setUserId(decode.userId);
                }
                else if (decode.userRole.toLowerCase() === 'author') {
                    setRole("editor");
                    setUserId(decode.userId);
                } else {
                    navigate('/latestblogspage');
                }
            }
        }
        else {
            setRole('null');
            localStorage.removeItem("x-token");
            navigate('/auth');
        }
    };

    const getLatestBlogs = async () => {
        try {
            setLoading(true);
            const result = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/getallposts?search=${content}&authorId=${userId}&pageNo=${pageNo}&sortOrder=${sort}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (result.status == 200) {
                setLatestBlogs(result.data.posts);
                setTotalPosts(result.data.totalPosts);
                setPageCount(Math.ceil(totalPosts / 20));
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching blogs:", err);
            if (err.response?.status === 401) {
                localStorage.removeItem("x-token");
                navigate('/auth');
            }
            setLoading(false);
        }
    };

    const handlePageChange = (event, value) => {
        setPageNo(value);
        console.log("Current page:", value);
    };


    return (
        <MainLayout>
            <Box sx={{display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:'100vh', width:{xs:'100vw', sm:'99vw'}}}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, justifyContent: 'center', width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: '430px' }}>
                        <TextField
                            label="search blogs"
                            name="search blogs"
                            type="text"
                            value={content}
                            onChange={(e) => { setContent(e.target.value) }}
                            required
                            sx={{
                                width: { xs: '90%', sm: '540px' }, m: 2, borderRadius: 5,
                                "& .MuiInputBase-root": { height: { xs: '35px' } }, "& .MuiOutlinedInput-root": { "&.Mui-focused fieldset": { borderColor: "black", borderRadius: 5 } }, textAlign: 'center'
                            }}
                        />
                        <Button variant='contained' sx={{ width: '100px', height: '35px', textAlign: 'center', borderRadius: 5 }} onClick={() => { getLatestBlogs(); }}>search</Button>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, m: { xs: '10px', sm: '25px' } }}>
                    {loading&&<CircularIndeterminate2 texts='Loading...'/>}
                    <Grid container spacing={2} justifyContent="center">
                        {latestBlogs.map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item._id}>
                                <MediaCard key={item._id} data={item} edit={true} deletes={true} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', minWidth: '100vw' }}>
                    <Pagination count={pageCount} page={pageNo} onChange={handlePageChange} />
                </Box>
            </Box>
        </MainLayout>
    )
}

export default MyBlogs
