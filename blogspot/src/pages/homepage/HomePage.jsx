import React from 'react'
import MainLayout from '../../layouts/mainlayout/MainLayout'
import HeroSection from '../../componets/HeroSection'
import Section from '../../componets/Section'
const HomePage = ({pages}) => {
  return (
    <MainLayout pages={pages}>
      <HeroSection/>
      <Section/>
    </MainLayout>
  )
}

export default HomePage
