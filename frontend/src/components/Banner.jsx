import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className='relative flex flex-col md:flex-row items-center bg-gradient-to-r from-primary via-blue-600 to-indigo-700 rounded-3xl px-8 sm:px-12 md:px-16 py-12 md:py-16 w-full mx-auto shadow-2xl mb-20 overflow-hidden'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20'></div>
        <div className='absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-20 translate-y-20'></div>
      </div>

      {/* Left Side */}
      <div className='flex-1 relative z-10 text-center md:text-left'>
        <div className='inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4'>
          <span className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></span>
          Trusted by 50,000+ Patients
        </div>
        <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight'>
          Book Your Appointment Today
        </h1>
        <p className='mt-4 text-lg text-white/80 max-w-md'>
          Consult with 500+ trusted doctors and specialists across various medical fields.
        </p>

        <div className='mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start'>
          <button
            onClick={() => { navigate('/login'); scrollTo(0, 0); }}
            className='px-8 py-3.5 text-base font-semibold text-primary bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300'
          >
            Get Started →
          </button>
          <button
            onClick={() => { navigate('/doctors'); scrollTo(0, 0); }}
            className='px-8 py-3.5 text-base font-semibold text-white border-2 border-white/30 rounded-full hover:bg-white/10 transition-all duration-300'
          >
            View Doctors
          </button>
        </div>

        {/* Stats */}
        <div className='mt-10 flex flex-wrap gap-8 justify-center md:justify-start'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-white'>500+</p>
            <p className='text-sm text-white/70'>Doctors</p>
          </div>
          <div className='text-center'>
            <p className='text-2xl font-bold text-white'>50k+</p>
            <p className='text-sm text-white/70'>Patients</p>
          </div>
          <div className='text-center'>
            <p className='text-2xl font-bold text-white'>4.9</p>
            <p className='text-sm text-white/70'>Rating</p>
          </div>
        </div>
      </div>

      {/* Right Image */}
      <div className='mt-8 md:mt-0 flex justify-center relative z-10'>
        <div className='relative'>
          <img 
            className='w-64 sm:w-80 drop-shadow-2xl' 
            src={assets.appointment_img} 
            alt="Appointment"
          />
          {/* Floating Badge */}
          <div className='absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3'>
            <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl'>✓</div>
            <div>
              <p className='text-sm font-semibold text-gray-800'>Verified</p>
              <p className='text-xs text-gray-500'>Doctors</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Banner;
