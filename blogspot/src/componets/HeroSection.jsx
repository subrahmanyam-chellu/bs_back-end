import Box from '@mui/material/Box'
import React, { useEffect } from 'react'
import hero from '../assets/hero.jpg';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleNavigate = ()=>{
      navigate('/auth');
  };

  return ( 
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent:'flex-start',
          backgroundColor:'#f4f4f4',
          gap:{xs:6, sm:4},
          px:{xs:0, sm:14},
          py:{xs:4, sm:4},
        }}
      >
        <Box
          component="img"
          src={hero}
          alt="hero section"
          sx={{
            width: { xs: '96%', sm: '50%' },
            maxHeight: { xs: '290px', sm: '390px' },
            objectFit: 'cover',
            borderRadius: 2,
            mx:{xs:'8px', sm:'45px'}
          }}
        />
        <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap:{xs:4, sm:2}, 
                justifyContent: 'center', 
                mx:{xs:'8px', sm:'25px'},
                width:{xs:'95%', sm:'50%'},
              }}>
          <Typography sx={{ fontSize:{xs:36, sm:42}, fontWeight: 'bold', color: 'black', textAlign:'center' }}>
            Share Your Voice With the World
          </Typography>

          <Typography sx={{ fontSize:{xs:24, sm:28}, color: 'text.secondary', textAlign:'center' }}>
            Join our community of passionate writers, storytellers, and creators.
            Start your blogging journey today and inspire readers everywhere.
          </Typography>
          <Typography sx={{ fontSize:{xs:24, sm:32}, fontWeight: 'bold', color: '#3b3a3a', textAlign:'left' }}>
            Let's get started..
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNavigate}
            sx={{ textTransform:'none', fontSize:{xs:18, sm:24}, borderRadius: 3, width: 'fit-content', fontWeight:'bold', color:'#060000'}}
          >
            Signup
          </Button>
        </Box>
      </Box>
  )
}

export default HeroSection