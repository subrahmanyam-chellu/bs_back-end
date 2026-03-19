import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'

const Footer = () => {
  return (
    <Box sx={{display:'flex', justifyContent:'center', backgroundColor:'black', height:{xs:'285px', md:'40px'}, width:'100%'}}>
        <Typography sx={{fontSize:12, color:'whitesmoke'}}>©️ AI_Support All righsts reserverd 2026</Typography>
    </Box>
  )
}

export default Footer
