import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className='mt-24 pb-16 px-4'>
      {/* Header */}
      <div className='text-center mb-12'>
        <h1 className='text-3xl md:text-4xl font-bold text-gray-800'>About Us</h1>
        <p className='mt-3 text-gray-500 max-w-xl mx-auto'>Learn more about MediCore and our mission to transform healthcare</p>
      </div>

      {/* About Section */}
      <div className='max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10 mb-16'>
        <div className='lg:w-1/2'>
          <img
            className='w-full rounded-3xl shadow-2xl'
            src={assets.about_image}
            alt="About MediCore"
          />
        </div>
        <div className='lg:w-1/2 space-y-6'>
          <div className='bg-white rounded-2xl p-6 shadow-lg border-l-4 border-primary'>
            <p className='text-gray-700 leading-relaxed'>
              Welcome to <b className='text-primary'>MediCore</b>, your trusted partner in managing your healthcare needs conveniently and efficiently. We understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
            </p>
          </div>
          <div className='bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500'>
            <p className='text-gray-700 leading-relaxed'>
              MediCore is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service.
            </p>
          </div>
          <div className='bg-white rounded-2xl p-6 shadow-lg'>
            <h3 className='text-xl font-bold text-gray-800 mb-3'>Our Vision</h3>
            <p className='text-gray-600 leading-relaxed'>
              Our vision at MediCore is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making access to care easier and more efficient.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-10'>
          <h2 className='text-2xl md:text-3xl font-bold text-gray-800'>Why Choose Us</h2>
          <p className='mt-2 text-gray-500'>What sets us apart from the rest</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {[
            {
              icon: '⚡',
              title: 'Efficiency',
              description: 'Streamlined appointment scheduling that fits into your busy lifestyle.',
              color: 'primary'
            },
            {
              icon: '🎯',
              title: 'Convenience',
              description: 'Access to a network of trusted healthcare professionals in your area.',
              color: 'green-500'
            },
            {
              icon: '💎',
              title: 'Personalization',
              description: 'Tailored recommendations and reminders to help you stay on top of your health.',
              color: 'purple-600'
            },
          ].map((item, index) => (
            <div
              key={index}
              className='bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100'
            >
              <div className='text-4xl mb-4'>{item.icon}</div>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>{item.title}</h3>
              <p className='text-gray-500'>{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className='mt-16 bg-gradient-to-r from-primary to-blue-600 rounded-3xl p-10 text-white'>
        <div className='max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
          <div>
            <p className='text-3xl font-bold'>500+</p>
            <p className='text-white/80'>Expert Doctors</p>
          </div>
          <div>
            <p className='text-3xl font-bold'>50k+</p>
            <p className='text-white/80'>Happy Patients</p>
          </div>
          <div>
            <p className='text-3xl font-bold'>50+</p>
            <p className='text-white/80'>Hospitals</p>
          </div>
          <div>
            <p className='text-3xl font-bold'>4.9</p>
            <p className='text-white/80'>Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

