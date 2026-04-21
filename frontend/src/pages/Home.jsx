import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import StatsSection from '../components/StatsSection'
import ChatComponent from './Chatbot'

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <StatsSection />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
      <ChatComponent />
    </div>
  )
}

export default Home