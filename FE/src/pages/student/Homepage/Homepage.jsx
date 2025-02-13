import React from 'react'
import Navbar from '../../components/homepage/Navbar'
import HowItWorks from '../../components/homepage/HowItWorks'
import Hero from '../../components/homepage/Hero'
import SuccessMetrics from '../../components/homepage/SuccessMetrics'
import ContactForm from '../../components/homepage/ContactForm'
import Footer from '../../components/homepage/Footer'
import './Homepage.css'

const Homepage = () => {
  return (
  <div>
    <Navbar/>
    <Hero/>
    <SuccessMetrics/>
    <HowItWorks/>
    <ContactForm/>
    <Footer/>
  </div>
  );
}

export default Homepage
