import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../../components/homepage/Navbar'
import HowItWorks from '../../components/homepage/HowItWorks'
import Hero from '../../components/homepage/Hero'
import SuccessMetrics from '../../components/homepage/SuccessMetrics'
import Testimonials from '../../components/homepage/Testimonials'
import Features from '../../components/homepage/Features'
import SignUpSection from '../../components/homepage/SignUpSection'
import Footer from '../../components/homepage/Footer'
import './Homepage.css'

const Homepage = () => {
  useEffect(() => {
    document.title = "Home";
  }, [])
  return (
  <div>
    <Navbar/>
    <Hero/>
    <SuccessMetrics/>
    <HowItWorks/>
    <Features/>
    <Testimonials/>
    <SignUpSection/>
    <Footer/>
  </div>
  );
}

export default Homepage
