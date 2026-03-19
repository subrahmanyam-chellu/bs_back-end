import Box from '@mui/material/Box'
import React from 'react'
import MainLayout from '../../layouts/mainlayout/MainLayout'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { useContext } from 'react'
import { UserContext } from '../../App'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'

const Profile = () => {

    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate('/profile/edit', { state: { user } });
    };

    return (
        <MainLayout>
            <Box sx={{display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:'100vh', width:{xs:'100vw', sm:'99vw'}}}>
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100vw' }}>
                    <Box sx={{
                        display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start', width: { xs: '100vw', sm: '425px' },
                        border: '2px solid black', borderRadius: 2, backgroundColor: '#f4f4f4', p: 2, m: { xs: 2, sm: 4 }
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <Avatar src={user.profileUrl} sx={{ height: '100px', width: '100px' }} />
                        </Box>
                        <Typography variant='h6'>Name: {user.name}</Typography>
                        <Divider />
                        <Typography variant='h6'>Email: {user.email}</Typography>
                        <Divider />
                        <Typography variant='h6'>Phone No: {user.phoneNumber} </Typography>
                        <Divider />
                        <Typography variant='h6'>Role: {user.role}</Typography>
                        <Divider />
                        {user.penName && <Typography variant='h6'>penName: {user.penName}</Typography>}
                        {/* <Button variant='contained' color='primary' size="medium" onClick={()=>{handleEdit();}}>Edit</Button> */}
                        <Button variant='contained' color='primary' size="medium" onClick={() => { navigate(-1); }}>Back</Button>
                    </Box>
                </Box>
            </Box>
        </MainLayout>
    )
}

export default Profile
