import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      alert('Thank you for subscribing!')
      setEmail('')
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white pt-16 pb-8 px-6 md:px-16">
      
      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-10 mb-12">
      
        <div className="lg:col-span-1">
          <img className="mb-5 w-44" src={assets.logo} alt="MediCore Logo" />
          <p className="text-slate-300 leading-7 text-sm">
            MediCore is dedicated to simplifying healthcare management. With cutting-edge technology, we connect patients and healthcare providers seamlessly.
          </p>
          
          {/* Newsletter */}
          <div className="mt-6">
            <p className="font-semibold text-white mb-3">Subscribe to our newsletter</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-primary text-sm"
              />
              <button type="submit" className="bg-primary px-4 py-2 rounded-lg text-white text-sm font-medium hover:bg-blue-600 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

       
        <div>
          <p className="text-lg font-semibold mb-5 text-white">COMPANY</p>
          <ul className="flex flex-col gap-3 text-slate-300">
            <li onClick={() => navigate('/')} className="hover:text-primary cursor-pointer transition-colors duration-200">Home</li>
            <li onClick={() => navigate('/about')} className="hover:text-primary cursor-pointer transition-colors duration-200">About Us</li>
            <li onClick={() => navigate('/doctors')} className="hover:text-primary cursor-pointer transition-colors duration-200">Find Doctors</li>
            <li onClick={() => navigate('/contact')} className="hover:text-primary cursor-pointer transition-colors duration-200">Contact</li>
            <li className="hover:text-primary cursor-pointer transition-colors duration-200">Privacy Policy</li>
          </ul>
        </div>

      
        <div>
          <p className="text-lg font-semibold mb-5 text-white">SERVICES</p>
          <ul className="flex flex-col gap-3 text-slate-300">
            <li className="hover:text-primary cursor-pointer transition-colors duration-200">Book Appointment</li>
            <li className="hover:text-primary cursor-pointer transition-colors duration-200">Online Consultation</li>
            <li className="hover:text-primary cursor-pointer transition-colors duration-200">Emergency Services</li>
            <li className="hover:text-primary cursor-pointer transition-colors duration-200">Health Checkups</li>
          </ul>
        </div>

      
        <div>
          <p className="text-lg font-semibold mb-5 text-white">GET IN TOUCH</p>
          <ul className="flex flex-col gap-3 text-slate-300">
            <li className="flex items-center gap-2">
              <span className="text-primary">📞</span> +91-212-456-7890
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✉️</span> medicorehospital@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">📍</span> 123 Medical Center, City
            </li>
          </ul>
         
          <div className="flex gap-4 mt-6">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300 text-lg">
              📘
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300 text-lg">
              🐦
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300 text-lg">
              📸
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300 text-lg">
              💼
            </a>
          </div>
        </div>

      </div>


      <div>
        <hr className="border-slate-600" />
        <p className="py-6 text-sm text-center text-slate-400">
          © {currentYear} MEDICORE.com - All Rights Reserved. Made with ❤️ for better healthcare.
        </p>
      </div>

    </footer>
  );
};

export default Footer;
