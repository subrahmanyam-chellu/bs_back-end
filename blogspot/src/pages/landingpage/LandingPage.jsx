import React, { useEffect, useState } from 'react'
import MainLayout from '../../layouts/mainlayout/MainLayout'
import HeroSection from '../../componets/HeroSection'
import Section from '../../componets/Section'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
const LandingPage = ({ pages }) => {
  
  const token = localStorage.getItem("x-token");
  const navigate = useNavigate();
  
  useEffect(()=>{
    if(token){
      const decode = jwtDecode(token);
      if(decode.exp*1000>Date.now()){
        navigate('/latestblogspage');
      }
    }
  },[]);


  return (
    <MainLayout pages={pages}>
      <HeroSection />
      <Section />
    </MainLayout>
  )
}

export default LandingPage
